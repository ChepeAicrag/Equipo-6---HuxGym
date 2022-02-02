from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Stock)
admin.site.register(Provider)
admin.site.register(HistoryInventory)
admin.site.register(Operation)
admin.site.register(OperationType)
