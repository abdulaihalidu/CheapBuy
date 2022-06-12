from django.urls import path
from base.views import order_views as ov

urlpatterns = [
    path('', ov.getOrders, name='get-orders'),
    path('add/', ov.addOrderItems, name='add-order'),
    path('myorders/', ov.getUserOrders, name='my-orders'),
    path('<str:pk>/deliver/', ov.markOrderAsDelivered, name='order-delivery'),
    path('<str:pk>/', ov.getOrder, name='get-order'),
    path('<str:pk>/pay/', ov.markOrderAsPaid, name='order-pay')

]
