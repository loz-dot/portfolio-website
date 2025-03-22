from django.db import models

class BlogModel(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    summary = models.TextField()
    image = models.FileField()

    def __str__(self):
        return self.title

