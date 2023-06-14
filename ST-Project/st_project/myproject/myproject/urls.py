from django.urls import path
from myapp.views import company_form

urlpatterns = [
    path('company/form/', company_form, name='company_form'),
]
