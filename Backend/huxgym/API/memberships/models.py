from django.db import models

# Create your models here.


class Membership(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField(max_length=100, blank=False, null=False)
    price = models.FloatField(blank=False, null=False)
    day = models.IntegerField(default=7, null=False)
    status_delete = models.BooleanField(default=False)

    folio = models.CharField(max_length=10, blank=False, null=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Membership'
        verbose_name_plural = 'Memberships'
        db_table = 'membership'
        ordering = ['id']
