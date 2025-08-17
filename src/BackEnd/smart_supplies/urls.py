from django.contrib import admin
from django.urls import path, include
from api.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls), # URL padrão do admin
    path('api/', include('api.urls')), # Incluindo as rotas para a api

    # Endpoints para autenticação via JWT
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
