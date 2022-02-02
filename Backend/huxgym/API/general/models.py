from django.db import models

class Module(models.Model):

    name = models.CharField(max_length=100, null=False, verbose_name='Nombre')
    description = models.CharField(
        max_length=100, null=False, verbose_name='Descripcion')
    status_delete = models.BooleanField(
        default=False, verbose_name='Status Delete')

    class Meta:
        verbose_name = 'Module'
        verbose_name_plural = 'Modules'
        db_table = 'Module'
        ordering = ('id', )

class Role(models.Model):

    name = models.CharField(max_length=100, null=False, verbose_name='Nombre')
    description = models.CharField(
        max_length=100, null=False, verbose_name='Descripcion')
    isSuperAdmin = models.BooleanField(
        default=False, verbose_name='Super admin')
    status_delete = models.BooleanField(
        default=False, verbose_name='Status Delete')
    module = models.ManyToManyField(Module, through='RoleModule')

    class Meta:
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'
        db_table = 'Role'
        ordering = ('id', )

class RoleModule(models.Model):

    role = models.ForeignKey(
        Role, on_delete=models.CASCADE, verbose_name='Id del Rol')
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, verbose_name='Id del Modulo')
    status = models.BooleanField(default=True, verbose_name='Status Delete')
    status_delete = models.BooleanField(
        default=False, verbose_name='Status Delete')

    class Meta:
        verbose_name = 'Role_Module'
        verbose_name_plural = 'Role_Modules'
        db_table = 'Role_Module'
        ordering = ('id', )


