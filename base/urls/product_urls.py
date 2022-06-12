from django.urls import path
from base.views import product_views as pv

urlpatterns = [
    path('', pv.getProducts, name='products'),
    path('create/',  pv.createProduct, name='create-product'),
    path('top/', pv.getTopProducts, name='top-products'),
    path('upload/', pv.imageUpload, name='image-upload'),
    path('<str:pk>/reviews/', pv.createProductReview, name='create-review'),
    path('<str:pk>/', pv.getProduct, name='product'),
    path('update/<str:pk>/', pv.updateProduct, name='update-product'),
    path('delete/<str:pk>/', pv.deleteProduct, name='delete-product'),
]
