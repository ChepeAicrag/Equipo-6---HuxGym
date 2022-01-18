from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Customer)
admin.site.register(Attendance)
admin.site.register(NutritionalSituation)
admin.site.register(TypeExtraInformation)
admin.site.register(HistoryClinic)
admin.site.register(BodyAttribute)
admin.site.register(TypeExtraInformation_HistoryClinic)
admin.site.register(BodyAttribute_HistoryClinic)
admin.site.register(Customer_Membership)