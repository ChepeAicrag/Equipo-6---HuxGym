from API.products.api.serializers import CategorySerializer, HistoryInventorySerializer, OperationSerializer, OperationTypeSerializer, ProductSerializer, ProviderSerializer, StockSerializer
from API.products.models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

#API PARA EL MODELO PRODUCT
@api_view(['GET', 'POST'])
def product_api_view(request):

    if  request.method == 'GET':
        product = Product.objects.all().filter(status_delete = False)
        product_serializer = ProductSerializer(product, many = True)
        return Response(product_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':

        data = request.data.copy()
        precio_c = data.get('price_c', None)
        if precio_c is None:
            return Response({'message': 'El precio de compra es requerido'}, status = status.HTTP_400_BAD_REQUEST)

        precio_s = data.get('price_s', None)
        if precio_s is None:
            return Response({'message': 'El precio de venta es requerido'}, status = status.HTTP_400_BAD_REQUEST)
        
        data['price_c'] = float(precio_c)
        data['price_s'] = float(precio_s)
    
        if data['price_s'] <= 0 or data['price_c'] <= 0:
            return Response({'message': 'El precio de compra o venta deben de ser mayores a 0'}, status=status.HTTP_400_BAD_REQUEST)

        if data['price_s'] < data['price_c']:
            return Response({'message': 'El precio de venta debe de ser mayor al precio de compra'}, status=status.HTTP_400_BAD_REQUEST)

        #producto = Product.objects.all().filter(name = request.data['name'], status_delete = False)
        #if producto:
        #    return Response({'message': 'Ya existe un producto con el mismo nombre'}, status=status.HTTP_400_BAD_REQUEST)
        objetos = Product.objects.all().filter(status_delete = False)
        for i in objetos:
            if i.name.upper() == request.data['name'].upper():
                return Response({'message': 'Ya existe un producto con ese nombre'},status = status.HTTP_400_BAD_REQUEST )


        product_serializer = ProductSerializer(data = data)
        if product_serializer.is_valid():
            product_serializer.save()
            producto = Product.objects.latest('id')
            stock = Stock(product_id = producto, amount = 0)
            stock.save()
            return Response({'message': 'Producto registrado correctamente'}, status = status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail_api_view(request,pk=None):
    product = Product.objects.filter(id = pk, status_delete = False).first()

    if product:

        if request.method == 'GET':
            product_serializer = ProductSerializer(product)
            return Response(product_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            data = request.data.copy()
            precio_c = data.get('price_c', None)
            if precio_c is None:
                return Response({'message': 'El precio de compra es requerido'}, status = status.HTTP_400_BAD_REQUEST)

            precio_s = data.get('price_s', None)
            if precio_s is None:
                return Response({'message': 'El precio de venta es requerido'}, status = status.HTTP_400_BAD_REQUEST)
        
            data['price_c'] = float(precio_c)
            data['price_s'] = float(precio_s)

            if data['price_s'] <= 0 or data['price_c'] <= 0:
                return Response({'message': 'El precio de compra o venta deben de ser mayores a 0'}, status=status.HTTP_400_BAD_REQUEST)

            if data['price_s'] < data['price_c']:
                return Response({'message': 'El precio de venta debe de ser mayor al precio de compra'}, status=status.HTTP_400_BAD_REQUEST)
            
            objetos = Product.objects.all().filter(status_delete = False)
            for i in objetos:
                if i.name.upper() == request.data['name'].upper() and i.id != pk:
                    return Response({'message': 'Ya existe un producto con ese nombre'},status = status.HTTP_400_BAD_REQUEST )

            product_serializer = ProductSerializer(product,data = data)
            if product_serializer.is_valid():
                product_serializer.save()
                return Response({'message': 'Producto actualizado correctamente'},  status = status.HTTP_200_OK)
            return Response(product_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            stock = Stock.objects.all().filter(product_id = product.id).first()
            if stock:
                if stock.amount > 0:
                    return Response({'message' : 'No puedes eliminar un producto que tiene stock'}, status = status.HTTP_400_BAD_REQUEST)
        
            product.status_delete = True
            product.save()
            return Response({'message' : 'Producto eliminado correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un producto con estos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO CATEGORY
@api_view(['GET', 'POST'])
def category_api_view(request):

    if  request.method == 'GET':
        category = Category.objects.all().filter(status_delete = False)
        category_serializer = CategorySerializer(category, many = True)
        return Response(category_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        categorias = Category.objects.all().filter(name = request.data['name'], status_delete = False)
        if categorias:
            return Response({'message' : 'Ya existe esta categoría'}, status=status.HTTP_400_BAD_REQUEST)
        category_serializer = CategorySerializer(data = request.data)
        if category_serializer.is_valid():
            category_serializer.save()
            return Response({'message': 'Categoría creada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def category_detail_api_view(request,pk=None):
    category = Category.objects.filter(id = pk, status_delete = False).first()

    if category:

        if request.method == 'GET':
            category_serializer = CategorySerializer(category)
            return Response(category_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            objetos = Category.objects.all().filter(name = request.data['name'], status_delete = False)
            categoria = objetos.all().exclude(id = category.id)
            if categoria:
                return Response({'message': 'Esta categoría ya existe'},  status = status.HTTP_400_BAD_REQUEST)
            category_serializer = CategorySerializer(category,data = request.data)
            if category_serializer.is_valid():
                category_serializer.save()
                return Response({'message': 'Categoría actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(category_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            stocks = Stock.objects.all()
            for i in stocks:
                if i.product_id.category_id.id == category.id and i.amount > 0:
                    return Response({'message' : 'No puedes eliminar una categoría con productos en stock'}, status = status.HTTP_400_BAD_REQUEST)
            productos = Product.objects.all().filter(category_id = category.id, status_delete = False)
            for j in productos:
                j.status_delete = True
                j.save()

            category.status_delete = True
            category.save()
            return Response({'message' : 'Categoría eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado una categoría con estos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO STOCK
@api_view(['GET', 'POST'])
def stock_api_view(request):

    if  request.method == 'GET':
        objetos = Stock.objects.all()
        for i in objetos:
            #Verificación del status_value de product
            if i.product_id.status_delete == True and i.status_delete == False:
                i.status_delete = True
                i.save()
        stock = objetos.all().filter(status_delete = False)
        stock_serializer = StockSerializer(stock, many = True)
        return Response(stock_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        stocks = Stock.objects.all().filter(product_id = request.data['product_id'])
        if stocks:
            return Response({'message': 'Ya existe un stock de este producto'}, status=status.HTTP_400_BAD_REQUEST)
        stock_serializer = StockSerializer(data = request.data)
        if stock_serializer.is_valid():
            stock_serializer.save()
            return Response({'message': 'Stock creado correctamente'}, status = status.HTTP_201_CREATED)
        return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def stock_detail_api_view(request,pk=None):
    stock = Stock.objects.filter(id = pk, status_delete = False).first()
    
    if stock:
        if stock.product_id.status_delete == False:

            if request.method == 'GET':
                stock_serializer = StockSerializer(stock)
                return Response(stock_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                

                stock_serializer = StockSerializer(stock,data = request.data)
                if stock_serializer.is_valid():

                    tipoOperacion = request.data['amount'] - stock.amount
                    
                    operation = {'amount': tipoOperacion,
                                 'description': "Se añadió al stock" if tipoOperacion > 0 else "Se retiró del stock",
                                 'operationType_id': 1 if tipoOperacion > 0 else 2}

                    operation_serializer = OperationSerializer(data= operation)
                    if operation_serializer.is_valid():
                        operation_serializer.save()

                        history = {'product_id': stock.product_id.id,
                                    'amount': stock.amount + tipoOperacion,
                                    'operation_id': Operation.objects.latest('id').id
                                    }

                        history_serializer = HistoryInventorySerializer(data = history)
                        if history_serializer.is_valid():
                            stock_serializer.save()
                            history_serializer.save()
                            return Response({'message': 'Stock actualizado correctamente'},  status = status.HTTP_200_OK)
                        return Response(history_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
                    return Response(operation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
                return Response(stock_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                historyInventories = HistoryInventory.objects.all().filter(status_delete = False, product_id = stock.product_id)
                for i in historyInventories:
                        i.status_delete = True
                        i.operation_id.status_delete = True
                        i.save()
                        i.operation_id.save()
                stock.status_delete = True
                stock.save()
                return Response({'message' : 'Stock eliminado correctamente'}, status = status.HTTP_200_OK)
        return Response({'message': 'No se ha encontrado un stock con estos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un stock con estos datos'}, status = status.HTTP_400_BAD_REQUEST)

#API PARA AÑADIR AL STOCK
@api_view(['GET', 'POST'])
def anadirStock(request, pk = None):
    stock = Stock.objects.filter(id = pk, status_delete = False).first()
    if stock:
        if request.method == 'GET':
            stock_serializer = StockSerializer(stock)
            return Response(stock_serializer.data, status= status.HTTP_200_OK)

        if request.method == 'POST':
            cantidadASumar = request.data['amount']
            if cantidadASumar <= 0:
                return Response({'message': 'La cantidad tiene que ser mayor a 0'}, status = status.HTTP_400_BAD_REQUEST)
            stock.amount = stock.amount + cantidadASumar
            stock.save()

            operation = {'amount': cantidadASumar,
                        'description': "Se añadió al stock" ,
                        'operationType_id': 1}

            operation_serializer = OperationSerializer(data= operation)
            if operation_serializer.is_valid():
                operation_serializer.save()

                history = {'product_id': stock.product_id.id,
                            'amount': stock.amount ,
                            'operation_id': Operation.objects.latest('id').id
                            }

                history_serializer = HistoryInventorySerializer(data = history)
                if history_serializer.is_valid():
                    history_serializer.save()
                    return Response({'message': 'Se añadío al stock correctamente'},  status = status.HTTP_200_OK)
                return Response(history_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
            return Response(operation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
    return Response({'message': 'No se encontró ese stock'},status = status.HTTP_400_BAD_REQUEST )

#API PARA RESTAR AL STOCK
@api_view(['GET', 'POST'])
def restarStock(request, pk = None):
    stock = Stock.objects.filter(id = pk, status_delete = False).first()
    if request.method == 'GET':
        stock_serializer = StockSerializer(stock)
        return Response(stock_serializer.data, status= status.HTTP_200_OK)

    if request.method == 'POST':
        cantidadARestar = request.data['amount']
        if cantidadARestar <= 0:
            return Response({'message': 'La cantidad tiene que ser mayor a 0'}, status = status.HTTP_400_BAD_REQUEST)
        if stock.amount - cantidadARestar < 0:
            return Response({'message': 'No puedes restar esa cantidad de producto porque solo tienes: ' + str(stock.amount)}, status = status.HTTP_400_BAD_REQUEST)
        
        stock.amount = stock.amount - cantidadARestar
        stock.save()

        operation = {'amount': cantidadARestar,
                    'description': "Se restó al stock" ,
                    'operationType_id': 2}

        operation_serializer = OperationSerializer(data= operation)
        if operation_serializer.is_valid():
            operation_serializer.save()

            history = {'product_id': stock.product_id.id,
                        'amount': stock.amount ,
                        'operation_id': Operation.objects.latest('id').id
                        }

            history_serializer = HistoryInventorySerializer(data = history)
            if history_serializer.is_valid():
                history_serializer.save()
                return Response({'message': 'Se restó al stock correctamente'},  status = status.HTTP_200_OK)
            return Response(history_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
        return Response(operation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )


#API PARA EL MODELO PROVIDER
@api_view(['GET', 'POST'])
def provider_api_view(request):


    if  request.method == 'GET':
        provider = Provider.objects.all().filter(status_delete = False)
        provider_serializer = ProviderSerializer(provider, many = True)
        return Response(provider_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        proveedores = Provider.objects.all().filter(status_delete = False)
        for i in proveedores:
            if i.name.upper() == request.data['name'].upper():
                return Response({'message' : 'Este proveedor ya existe'}, status=status.HTTP_400_BAD_REQUEST)
            if i.rfc.upper() == request.data['rfc'].upper():
                return Response({'message' : 'El RFC de este proveedor ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(request.data['rfc']) != 13:
                return Response({'message' : 'El RFC está incompleto'}, status=status.HTTP_400_BAD_REQUEST)
        


        provider_serializer = ProviderSerializer(data = request.data)
        if provider_serializer.is_valid():
            provider_serializer.save()
            return Response({'message': 'Proveedor creado correctamente'}, status = status.HTTP_201_CREATED)
        return Response(provider_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def provider_detail_api_view(request,pk=None):
    provider = Provider.objects.filter(id = pk, status_delete = False).first()

    if provider:

        if request.method == 'GET':
            provider_serializer = ProviderSerializer(provider)
            return Response(provider_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            proveedores = Provider.objects.all().filter(status_delete = False)
            for i in proveedores:
                if i.name.upper() == request.data['name'].upper() and provider.id != pk:
                    return Response({'message' : 'Este proveedor ya existe'}, status=status.HTTP_400_BAD_REQUEST)
                if i.rfc.upper() == request.data['rfc'].upper() and provider.id != pk:
                    return Response({'message' : 'El rfc de este proveedor ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        
            provider_serializer = ProviderSerializer(provider,data = request.data)
            if provider_serializer.is_valid():
                provider_serializer.save()
                return Response({'message': 'Proveedor actualizado correctamente'},  status = status.HTTP_200_OK)
            return Response(provider_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            stocks = Stock.objects.all()
            for i in stocks:
                if i.product_id.provider_id.id == provider.id and i.amount > 0:
                    return Response({'message' : 'No puedes eliminar un proveedor con productos en stock'}, status = status.HTTP_400_BAD_REQUEST)
            productos = Product.objects.all().filter(provider_id = provider.id, status_delete = False)
            for j in productos:
                j.status_delete = True
                j.save()

            provider.status_delete = True
            provider.save()
            return Response({'message' : 'Proveedor eliminado correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un proveedor con estos datos'}, status = status.HTTP_400_BAD_REQUEST)



#API PARA EL MODELO HISTORYINVENTORY
@api_view(['GET', 'POST'])
def historyInventory_api_view(request):

    if  request.method == 'GET':
        historyInventory = HistoryInventory.objects.all().filter(status_delete = False)
        for i in historyInventory:
            if i.product_id.status_delete == True and i.status_delete == False:
                i.status_delete = True
                i.save()
        historyInventory1 = historyInventory.all().filter(status_delete = False)
        historyInventory_serializer = HistoryInventorySerializer(historyInventory1, many = True)
        return Response(historyInventory_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        historyInventory_serializer = HistoryInventorySerializer(data = request.data)
        if historyInventory_serializer.is_valid():
            historyInventory_serializer.save()
            return Response({'message': 'Historial de inventario creado correctamente'}, status = status.HTTP_201_CREATED)
        return Response(historyInventory_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def historyInventory_detail_api_view(request,pk=None):
    historyInventory = HistoryInventory.objects.filter(id = pk, status_delete = False).first()

    if historyInventory:

        if request.method == 'GET':
            historyInventory_serializer = HistoryInventorySerializer(historyInventory)
            return Response(historyInventory_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            historyInventory_serializer = HistoryInventorySerializer(historyInventory,data = request.data)
            if historyInventory_serializer.is_valid():
                historyInventory_serializer.save()
                return Response({'message': 'Historial de inventario actualizado correctamente'},  status = status.HTTP_200_OK)
            return Response(historyInventory_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            historyInventory.status_delete = True
            historyInventory.save()
            return Response({'message' : 'Historial de inventario eliminado correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un registro de inventario con estos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO OPERATION
@api_view(['GET', 'POST'])
def operation_api_view(request):

    if  request.method == 'GET':
        operation = Operation.objects.all().filter(status_delete = False)
        operation_serializer = OperationSerializer(operation, many = True)
        return Response(operation_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        operation_serializer = OperationSerializer(data = request.data)
        if operation_serializer.is_valid():
            operation_serializer.save()
            return Response({'message': 'Operación creada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(operation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def operation_detail_api_view(request,pk=None):
    operation = Operation.objects.filter(id = pk, status_delete = False).first()

    if operation:

        if request.method == 'GET':
            operation_serializer = OperationSerializer(operation)
            return Response(operation_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            operation_serializer = OperationSerializer(operation,data = request.data)
            if operation_serializer.is_valid():
                operation_serializer.save()
                return Response({'message': 'Operación actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(operation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            operation.status_delete = True
            operation.save()
            return Response({'message' : 'Operación eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado una operación con estos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO OPERATIONTYPE
@api_view(['GET', 'POST'])
def operationType_api_view(request):

    if  request.method == 'GET':
        operationType = OperationType.objects.all().filter(status_delete = False)
        operationType_serializer = OperationTypeSerializer(operationType, many = True)
        return Response(operationType_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        operationType_serializer = OperationTypeSerializer(data = request.data)
        if operationType_serializer.is_valid():
            operationType_serializer.save()
            return Response({'message': 'Tipo de operación creada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(operationType_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def operationType_detail_api_view(request,pk=None):
    operationType = OperationType.objects.filter(id = pk, status_delete = False).first()

    if operationType:

        if request.method == 'GET':
            operationType_serializer = OperationTypeSerializer(operationType)
            return Response(operationType_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            operationType_serializer = OperationTypeSerializer(operationType,data = request.data)
            if operationType_serializer.is_valid():
                operationType_serializer.save()
                return Response({'message': 'Tipo de operación actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(operationType_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            operationType.status_delete = True
            operationType.save()
            return Response({'message' : 'Tipo de operación eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un tipo de operación con estos datos'}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def productosPorProveedor(request,pk=None):

    if request.method == 'GET':
        productos = Product.objects.all().filter(status_delete=False, provider_id = pk)
        productos_serializer = ProductSerializer(productos, many=True)
        return Response(productos_serializer.data,  status = status.HTTP_200_OK)


@api_view(['GET'])
def stockDeProducto(request,pk=None):

    if request.method == 'GET':
        stock = Stock.objects.all().filter(status_delete=False, product_id = pk).first()
        stock_serializer = StockSerializer(stock)
        return Response(stock_serializer.data,  status = status.HTTP_200_OK)
