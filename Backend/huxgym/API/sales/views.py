from datetime import datetime
from _datetime import timedelta
from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..customers.models import Customer
from ..customers.api.serializers import CustomerSerializer
from ..general.authentication_middleware import Authentication
from ..products.api.serializers import ProductSerializer
from ..products.models import Product, Stock
from ..users.models import CashRegister
from .models import Sale, SaleDetailsProduct, SaleDetailsMembership
from .serializers import SaleSerializer

# Necesitamos el producto exista y tenga stock
# Necesitamos auemntar la cantidad en caja de lo vendido
# Validar el dinero de caja
# Si se da cambio debemos considerar este dinero_
# cambio = total de efectivo del cliente - total de la venta

# Obtener ventas del día
import json
from API.products.api.serializers import HistoryInventorySerializer, OperationSerializer
from API.products.models import Operation
from API.users.models import User
from API.sales.serializers import SaleDetailsMembershipSerializer, SaleDetailsProductSerializer
from API.memberships.models import Membership
from API.customers.api.serializers import Customer_MembershipSerializer


class CreateListSale(Authentication, APIView):

    def validate_customer_caja_cash(self, user, data):
        
        find_customer, caja, cash = None, None, None

        # Validaciones del cliente
        customer_id = data.get('customer_id', None)
        if customer_id is None:
            return  find_customer, caja, cash, {'message': 'El id del cliente es requerido'}
        find_customer = Customer.objects.filter(
            status_delete=False, id=customer_id).first()
        if not find_customer:
            return find_customer, caja, cash, {'message': 'No existe dicho cliente'}

        # Validaciones de la caja registradora
        find_caja = CashRegister.objects.filter(user=user,
                                                status_delete=False, date=datetime.now())
        if not find_caja.exists():
            return find_customer, caja, cash, {'message': 'No tiene una caja abierta'}

        caja = CashRegister.objects.get(user=user,
                                        status_delete=False, date=datetime.now())
        if not caja.status:
            return find_customer, caja, cash, {'message': 'La caja de este día ya fue cerrada. no puede realizar más ventas'}

        # Validación del efectivo dado por el cliente
        cash = data.get('cash', None)
        if cash is None or cash < 0:
            return find_customer, caja, cash, {'message': 'El dinero en efectivo es requerido'}

        # Validaciones de productos
        products = data.get('products', None)
        if products is None:
            return find_customer, caja, cash, {'message': 'Se requiere la lista de productos'}

        if len(products) < 1:
            return find_customer, caja, cash, {'message': 'Se requiere al menos un producto'}
        
        return find_customer, caja, cash, None

    def get(self, request):
        user = self.user
        response = []
        sales = Sale.objects.all().filter(status_delete=False) if user.role.id == 1 else Sale.objects.all(
        ).filter(status_delete=False, user=user)
        for sale in sales:
            if sale.user.is_active and not sale.user.status_delete:
                serializer_venta = SaleSerializer(sale, many=False)
                sale_detail = SaleDetailsProduct.objects.all().filter(sale=sale, status_delete=False)
                if len(sale_detail) > 0:
                    product = True
                    serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=True) 
                else:
                    product =False
                    sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False)
                    serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=True)
                response.append({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data, 'is_product': product})
        return Response(response, status=status.HTTP_200_OK)

    # Petición que solicita únicamente un token
    # customer_id
    # products - lista de productos [1, 2, 3, ...] 
    def post(self, request):
        user = self.user
        data = request.data.copy()
        
        # Validar observaciones 
        observation = data.get('observation', None)
        if  observation is None or observation == '':
            return Response({'message': 'El campo observación es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Indicador si son productos o membresía
        is_products = data.get('is_products', None)
        if is_products is None:
            return Response({'message': 'Se requiere el campo is_products'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validaciones de cliente, caja y cash
        find_customer, caja, cash, msj = self.validate_customer_caja_cash(user, data)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        
        products = data.get('products')
        total_a_pagar, membership = 0, None
        products_find, products_stock = [], []  # (id, cantidad a reducir)
    
        # Revisamos si es venta de membresía y calculamos el total a pagar
        if not is_products:
            if len(products) != 1:
                return Response({'message': 'Debe ser un solo producto, no se permiten más'}, status=status.HTTP_400_BAD_REQUEST)
            product = products[0]
            if len(product) != 2:
                return Response({'message': 'La información del producto debe ser [id, cantidad]'}, status=status.HTTP_400_BAD_REQUEST)
            membership_id, cantidad = product
            if cantidad != 1:
                return Response({'message': 'Solo se puede realizar la venta de una membresía por venta'}, status=status.HTTP_400_BAD_REQUEST)
            if find_customer.membershipActivate and find_customer.id != 1: 
                return Response({'message': 'El cliente ya tiene una membresía activa'}, status=status.HTTP_400_BAD_REQUEST)    
            membership = Membership.objects.filter(id=membership_id, status_delete=False).first()
            if not membership:
                return Response({'message': 'Membresía no encontrada'}, status=status.HTTP_400_BAD_REQUEST)
            
            total_a_pagar = membership.price * cantidad  

        # Productos en este caso
        else:
            for p in products:
                p_id = p[0]
                cantidad = p[1] if p[1] != None else 0

                if cantidad <= 0:
                    return Response(
                        {'message': f'Debe introducir una cantidad a vender del producto con id = {p_id}'}, status=status.HTTP_400_BAD_REQUEST)

                # Buscamos el posible producto
                product = Product.objects.filter(id=p_id, status_delete=False)
                if not product.exists():
                    return Response(
                        {'message': f'No existe el producto con id = {p_id}'}, status=status.HTTP_400_BAD_REQUEST)

                product_find = Product.objects.get(
                    id=p_id, status_delete=False)

                # Validar el stock del producto
                stock = Stock.objects.filter(product_id=product_find, status_delete = False).first()
                if not stock:
                    return Response(
                        {'message': f'El producto con id = {p_id} no tiene stock registrado'}, status=status.HTTP_400_BAD_REQUEST)
                if stock.amount < 0 or stock.amount < cantidad:
                    return Response(
                        {'message': f'El stock del producto con id = {p_id} no cubre la cantidad solicitada'}, status=status.HTTP_400_BAD_REQUEST)
                # Total a pagar de cada producto
                # Calculando el total a pagar de toda la venta
                product = product_find
                total_product = product.price_s * cantidad
                total_a_pagar += total_product

                products_stock.append((product.id, cantidad, total_product))
                products_find.append(product)

        # Sin importar si es de productos o membrsías
        # Validación del dinero que da el cliente y el total de la venta
        if (cash < total_a_pagar):
            return Response({'message': 'El dinero en efectivo es insuficiente para pagar la venta'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Validamos que podemos dar cambio
        cambio = cash - total_a_pagar
        if caja.cash_end < cambio:
            return Response({'message': 'No hay suficiente dinero para dar cambio en efectivo'}, status=status.HTTP_400_BAD_REQUEST)

        # Creación de la venta
        sale = Sale(user=user, customer=find_customer, cash_register=caja, cash=cash, total=total_a_pagar, observation=observation)
        sale.save()

        # Verificamos que detalles de venta crear
        if is_products:
            # Registro de los detalles de la venta y actualización del stock
            for p_id, amount, total in products_stock:
                p = Product.objects.get(id=p_id)
                sale_details = SaleDetailsProductSerializer(data = { 'sale': sale.id, 'product': p.id, 'amount': amount, 'total': total})
                sale_details.is_valid(raise_exception=True)
                sale_details.save()
                stock = Stock.objects.get(product_id=p)
                stock.amount -= amount
                stock.save()
                operation = {'amount': amount,
                            'description': "Se restó al stock",
                            'operationType_id': 2}
                operation_serializer = OperationSerializer(data=operation)
                operation_serializer.is_valid(raise_exception=True)
                operation_serializer.save()
                history = {'product_id': stock.product_id.id,
                        'amount': stock.amount,
                        'operation_id': Operation.objects.latest('id').id
                        }
                history_serializer = HistoryInventorySerializer(data=history)
                history_serializer.is_valid(raise_exception=True)
                history_serializer.save()
        else: 
            # Registgro del detalle venta
            sale_details = SaleDetailsMembershipSerializer(data = {'sale': sale.id, 'membership': membership.id, 'amount': 1, 'total': total_a_pagar})
            sale_details.is_valid(raise_exception=True)
            sale_details.save()
            
            # Registro de la relación membresía y cliente      
            hoy = datetime.now()
            data_customer_membership = {
                'customer_id': find_customer.id, 
                'membership_id': membership.id, 
                'date_due': datetime.date(hoy + timedelta(days=membership.day))
            }
            customer_membership = Customer_MembershipSerializer(data = data_customer_membership)
            customer_membership.is_valid(raise_exception=True)
            customer_membership.save()

            # Actualizamos al cliente
            find_customer.membershipActivate = True
            find_customer.save()
        
        # # Actualización de la caja
        caja.amount_sell += total_a_pagar
        caja.amount_total = caja.amount_sell - caja.amount_purchase
        caja.cash_end = caja.cash_init + caja.amount_total - cambio
        caja.cambio = cambio
        caja.save()
        serializer = SaleSerializer(sale)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Ventas del usuario logueado
class ListUpdateDeleteSaleLogueado(Authentication, APIView):

    msj_sale_not_found = 'Venta no encontrada'
    msj_user_not_have_sale = 'La venta dada no le pertenece al usuario dado'
    msj_observation_required = 'La observación es requerida'

    def validate_sale(self, user, id): 
        sale = Sale.objects.filter(status_delete=False, id=id).first()
        if not sale:
            return None, {'message': self.msj_sale_not_found}  
        if sale.user.id != user.id:
            return None, {'message': self.msj_sale_not_found}
        return sale, None

    def get(self, request, id):
        user = self.user
        sale, msj = self.validate_sale(user, id)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        serializer_venta = SaleSerializer(sale, many=False)
        serializer_detail_venta = None

        # Suponemos que es una venta de producto y buscamos sus detalles
        sale_detail = SaleDetailsProduct.objects.filter(sale=sale, status_delete=False).first()
        if sale_detail:
            serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=False)
        # Si no es una venta de producto, entonces de membresía y buscamos dicho dato
        else:
            sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False).first()
            serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=False)
        return Response({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data}, status=status.HTTP_200_OK)

    def put(self, request, id):
        user = self.user
        sale, msj = self.validate_sale(user, id)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        observation = request.data.get('observation', None)
        if observation is None or observation == '':
            return Response({'message': self.msj_observation_required}, status=status.HTTP_400_BAD_REQUEST)
        sale.observation = observation
        sale.save()    
        sale_updated = SaleSerializer(sale, many=False)
        return Response(sale_updated.data, status=status.HTTP_200_OK)

# Funciones para el adminitrador pueda obtener, editar y eliminar la venta de un empleado
# Ventas para productos y membresias
class ListUpdateDeleteSaleAdmin(Authentication, APIView):

    msj_sale_not_found = 'Venta no encontrada'
    msj_user_not_found = 'Empleado no encontrado'
    msj_user_not_have_sale = 'La venta dada no le pertenece al usuario dado'
    msj_sale_delete_ok = 'Venta eliminada satisfactoriamente'

    def validate_user(self, id_employee):
        user = User.objects.filter(id=id_employee, status_delete=False, is_active=True).first()
        if not user:
            return None, {'message': self.msj_user_not_found} 
        return User, None 

    def validate_user_sale(self, id_employee, id_sale):
        user_logueado = self.user
        if user_logueado.role.id != 1: 
            return  None, None, {'message': 'No tiene permisos para realizar esta acción'}
        user, msj = self.validate_user(id_employee)
        if user is None: 
            return None, user, msj
        sale = Sale.objects.filter(status_delete=False, id=id_sale).first()
        if not sale:
            return None, None, {'message': self.msj_sale_not_found}
        if sale.user.id != id_employee:
            return None, None, {'message': self.msj_user_not_have_sale}
        return user, sale, None

    # Campos del detalle venta
    def get(self, request, id_employee, id_sale):

        if id_sale == 0:
            user, msj = self.validate_user(id_employee)
            if user is None:
                return Response(msj, status=status.HTTP_400_BAD_REQUEST)
            sales = Sale.objects.all().filter(status_delete=False, )
            response = []
            for sale in sales:
                if sale.user.is_active and not sale.user.status_delete:
                    serializer_venta = SaleSerializer(sale, many=False)
                    sale_detail = SaleDetailsProduct.objects.filter(sale=sale, status_delete=False).first()
                    if sale_detail:
                        serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=False) 
                    else:
                        sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False).first()
                        serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=False)
                    response.append({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data})
            return Response(response, status=status.HTTP_200_OK)

        user, sale, msj = self.validate_user_sale(id_employee, id_sale)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)

        serializer_venta = SaleSerializer(sale, many=False)
        serializer_detail_venta = None

        # Suponemos que es una venta de producto y buscamos sus detalles
        sale_detail = SaleDetailsProduct.objects.filter(sale=sale, status_delete=False).first()
        if sale_detail:
            serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=False)
        # Si no es una venta de producto, entonces de membresía y buscamos dicho dato
        else:
            sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False).first()
            serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=False)
        return Response({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data}, status=status.HTTP_200_OK)

    def put(self, request, id_employee, id_sale):
        user, sale, msj = self.validate_user_sale(id_employee, id_sale)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        observation = request.data.get('observation', None)
        if observation is None:
            return Response({'message': self.msj_observation_required}, status=status.HTTP_400_BAD_REQUEST)
        sale.observation = observation
        sale.save()
        sale_updated = SaleSerializer(sale, many=False)
        return Response(sale_updated.data, status=status.HTTP_200_OK)

    def delete(self, request, id_employee, id_sale):
        
        user, sale, msj = self.validate_user_sale(id_employee, id_sale)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)

        if sale.cash_register.status == True:
                return Response({'message': 'No puedes eliminar una venta si su caja está abierta'},status = status.HTTP_400_BAD_REQUEST )

        sale.status_delete = True
        sale.save()
        sale_details = SaleDetailsProduct.objects.all().filter(sale=sale, status_delete=False)
        for sale_detail in sale_details:
            sale_detail.status_delete = True
            sale_detail.save()
        return Response({'message': self.msj_sale_delete_ok} , status=status.HTTP_200_OK)
