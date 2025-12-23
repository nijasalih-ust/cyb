from django.contrib import admin
from django.urls import path,include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
urlpatterns = [
    #admin
    path('admin/', admin.site.urls),
    #auth & jwt
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/auth/', include('rest_framework.urls')),# browsable API login
    # api paths
   path('api/', include('api.urls'))
]
