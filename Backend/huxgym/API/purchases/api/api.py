from API.purchases.api.serializers import *
from API.purchases.models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from API.general.authentication_middleware import Authentication
from rest_framework.views import APIView
from datetime import datetime
from API.products.models import Stock, OperationType, Operation, HistoryInventory
from API.products.api.serializers import OperationSerializer, OperationTypeSerializer, HistoryInventorySerializer

@api_view(['GET', 'POST'])
def purchase_api_view(request):

    if  request.method == 'GET':
        purchases = Purchase.objects.all().filter(status_delete = False)
        purchases_serializer = PurchaseSerializer(purchases, many = True)
        return Response(purchases_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        purchase_serializer = PurchaseSerializer(data = request.data)
        if purchase_serializer.is_valid():
            purchase_serializer.save()
            return Response({'message':'Compra registrada con exito'}, status = status.HTTP_201_CREATED)
        return Response(purchase_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class obtenerCompras(Authentication, APIView):       
    def get(self, request):
            user = self.user
            response = []
            purchases = Purchase.objects.all().filter(status_delete=False) if user.role.id == 1 else Purchase.objects.all(
            ).filter(status_delete=False, user_id=user)
            for purchase in purchases:
                if purchase.user_id.is_active and not purchase.user_id.status_delete:
                    serializer_purchase = PurchaseSerializer(purchase, many=False)
                    purchase_detail = Purchase_Details_Product.objects.all().filter(purchase_id=purchase.id, status_delete=False)
                    serializer_detail_purchase = PurchaseProductSerializer(purchase_detail, many=True) 
                    response.append({ 'Purchase': serializer_purchase.data, 'purchase_detail': serializer_detail_purchase.data})
            return Response(response, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT', 'DELETE'])
def purchase_detail_api_view(request,pk=None):
    purchase = Purchase.objects.filter(id = pk, status_delete = False).first()

    if purchase:

        if request.method == 'GET':
            purchase_serializer = PurchaseSerializer(purchase)
            return Response(purchase_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            if request.data['observation'] != '':
                purchase.observation = request.data['observation']
                purchase.save()     
                return Response({'message': 'Compra actualizada correctamente'},  status = status.HTTP_200_OK)
            else:
                return Response({'message': 'El campo observación es requerido'},status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            if purchase.cashRegister_id.status == True:
                return Response({'message': 'No puedes eliminar una compra si su caja está abierta'},status = status.HTTP_400_BAD_REQUEST )
            purchase.status_delete = True
            purchase.save()
            return Response({'message' : 'Compra eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado una compra con estos datos'}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def purchaseProduct_api_view(request):

    if  request.method == 'GET':
        purchases = Purchase_Details_Product.objects.all().filter(status_delete = False)
        purchases_serializer = PurchaseProductSerializer(purchases, many = True)
        return Response(purchases_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        purchase_serializer = PurchaseProductSerializer(data = request.data)
        if purchase_serializer.is_valid():
            purchase_serializer.save()
            return Response({'message':'Compra registrada con exito'}, status = status.HTTP_201_CREATED)
        return Response(purchase_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def purchaseProduct_detail_api_view(request,pk=None):
    purchase = Purchase_Details_Product.objects.filter(id = pk, status_delete = False).first()

    if purchase:

        if request.method == 'GET':
            purchase_serializer = PurchaseProductSerializer(purchase)
            return Response(purchase_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            purchase_serializer = PurchaseProductSerializer(purchase,data = request.data)
            if purchase_serializer.is_valid():
                purchase_serializer.save()
                return Response({'message': 'Compra actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(purchase_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':

            purchase.status_delete = True
            purchase.save()
            return Response({'message' : 'Compra eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado una compra con estos datos'}, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def obtenerDetallesCompra(request, pk = None):

    if  request.method == 'GET':
        purchasesProduct = Purchase_Details_Product.objects.all().filter(status_delete = False, purchase_id = pk)
        purchases_serializer = PurchaseProductSerializer(purchasesProduct, many = True)
        return Response(purchases_serializer.data, status = status.HTTP_200_OK)


class realizarCompra(Authentication, APIView):

    def post(self, request):
        user = self.user
        data = request.data.copy()

        observation = data.get('observation', None)
        if  observation is None or observation == '':
            return Response({'message': 'El campo observación es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        caja1 = CashRegister.objects.filter(user = user, date = datetime.now())

        if not caja1.exists():
            return Response({'message': 'No tiene una caja abierta'},
                            status=status.HTTP_400_BAD_REQUEST)

        caja = CashRegister.objects.get(user=user,status_delete=False, date=datetime.now())
        
        if not caja.status:
            return Response({'message': 'La caja de este día ya fue cerrada. no puede realizar más compras'},
                            status=status.HTTP_400_BAD_REQUEST)

        products = request.data.get('products', None)
        if products is None:
            return Response({'message': 'Se requiere la lista de productos'},
                            status=status.HTTP_400_BAD_REQUEST)
        if len(products) < 1:
            return Response({'message': 'Se requiere al menos un producto'},
                            status=status.HTTP_400_BAD_REQUEST)

        products_find = []
        total_a_pagar = 0
        products_stock = []  # (id, cantidad a añadir)

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

            # Serializamos el producto encontrado
            # serializer = ProductSerializer(product_find, many=False)
            # serializer.is_valid(raise_exception=True)
            product = product_find
            total_product = product.price_c * cantidad
            total_a_pagar += total_product
            products_stock.append((product.id, cantidad, total_product))
            products_find.append(product)  # Productos serializada
        
        #Validación de que la caja tenga dinero para hacer la compra
        if (caja.cash_end < total_a_pagar):
            return Response({'message': 'La caja no tiene suficiente dinero para esa compra'},
                            status=status.HTTP_400_BAD_REQUEST)

        #Creación de la compra
        purchase = Purchase(total=total_a_pagar, user_id=user, cashRegister_id = caja, observation=observation)
        purchase.save()

        # Registro de los detalles de la venta y actualización del stock
        for p_id, amount, total in products_stock:
            p = Product.objects.get(id=p_id)
            detalle = Purchase_Details_Product(purchase_id=purchase, product_id=p, amount=amount, total=total)
            detalle.save()
            stock = Stock.objects.get(product_id=p)
            stock.amount += amount
            stock.save()
            operation = {'amount': amount,
                        'description': "Se añadió al stock",
                        'operationType_id': 1}
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



        # # Actualización de la caja
        caja.amount_purchase += total_a_pagar
        caja.amount_total = caja.amount_sell - caja.amount_purchase
        caja.cash_end -= total_a_pagar
        caja.save()
        #Retornar toda la información de la venta, así cómo de los productos vendidos
        return Response({'message': 'Compra realizada'}, status=status.HTTP_201_CREATED)
        # except Exception:
        #     return Response(Exception, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtenerComprasHechasAdmin(request, pk = None):

    if  request.method == 'GET':
        compras = Purchase.objects.all().filter(status_delete = False, user_id = pk)
        compras_serializer = PurchaseSerializer(compras, many = True)
        return Response(compras_serializer.data, status = status.HTTP_200_OK)

class obtenerComprasHechasUsuario(Authentication, APIView):

    def get(self, request):
        usuario = self.user
        compras = Purchase.objects.all().filter(status_delete = False, user_id = usuario.id)
        purchases_serializer = PurchaseSerializer(compras, many = True)
        return Response(purchases_serializer.data, status = status.HTTP_200_OK)