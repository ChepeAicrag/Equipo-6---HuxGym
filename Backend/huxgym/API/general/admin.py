from django.contrib import admin
from .models import Role, Module, RoleModule

# Register your models here.
admin.site.register(Role)
admin.site.register(Module)
admin.site.register(RoleModule)