
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status


from base.models import Product, Review
from base.serializers import ProductSerializer


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    # prefilling the details of the product and then editing it
    # in the product edit page.
    # the product edit page loads authomatically after creating a roduct
    product = Product.objects.create(
        user=user,
        name='name',
        price=0,
        brand='brand',
        category='category',
        countInStock=0,
        description='description'

    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')

    if query == None:
        query = ''

    products = Product.objects.filter(
        name__icontains=query).order_by('-rating')

    page = request.query_params.get('page')
    paginator = Paginator(products, 4)

    try:
        # return the page on which the searched product is found
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)  # return first page
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({
        'products': serializer.data,
        'page': page,
        'pages': paginator.num_pages
    })


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:10]
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serialized = ProductSerializer(product, many=False)
    return Response(serialized.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):

    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.brand = data['brand']
    product.category = data['category']
    product.countInStock = data['countInStock']
    product.price = (data['price'])
    product.description = data['description']

    product.save()
    serialized = ProductSerializer(product, many=False)
    return Response(serialized.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response("Product deleted succesfully!")


@api_view(['POST'])
def imageUpload(request):
    data = request.data
    productId = data['product_id']

    product = Product.objects.get(_id=productId)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Product image uploaded successfully')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data

    product = Product.objects.get(_id=pk)
    # A user shouldn't be permitted to submit more than one review per product
    reviewExist = product.review_set.filter(user=user).exists()

    if reviewExist:
        content = {
            'detail': 'Review already submitted for this product!'
        }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = {
            'detail': 'Please provide a rating'
        }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for r in reviews:
            total += r.rating
        product.rating = total/len(reviews)
        product.save()

        return Response('Review added successfully')
