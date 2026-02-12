from django.db import models
from authentication.models import User

class AnalysisLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='analysis_images/')
    result = models.JSONField()
    confidence = models.FloatField()
    processing_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Analyse par {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
