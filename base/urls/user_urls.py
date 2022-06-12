
from django.urls import path
from base.views import user_views as uv

urlpatterns = [
    path('', uv.getUsers, name='users'),
    path('login/', uv.MyTokenObtainPairView.as_view(),
         name='token-obtain-pair'),
    path('register/', uv.registerUser, name='register'),
    path('profile/', uv.getUserProfile, name='users-profile'),
    path('profile/update/', uv.updateUserProfile, name='update-user-profile'),
    path('<str:pk>/', uv.getUserbyId, name='get-user'),
    path('update/<str:pk>/', uv.updateUser, name='update-user'),
    path('delete/<str:pk>/', uv.deleteUser, name='delete-user')

]
