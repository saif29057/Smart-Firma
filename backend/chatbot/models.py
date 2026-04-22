from django.db import models

class ChatMessage(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Chat with {self.user.username} at {self.created_at}"
