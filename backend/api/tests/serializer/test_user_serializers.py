import pytest
from django.contrib.auth import get_user_model
from api.serializers import UserSerializer

User = get_user_model()


@pytest.mark.django_db
class TestUserSerializer:
    def test_password_hashing(self):
        """Password should be hashed via set_password()"""
        data = {"email": "test@example.com", "password": "plaintext123"}
        serializer = UserSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        
        assert user.password != "plaintext123"
        assert user.check_password("plaintext123")

    def test_password_write_only(self):
        """Password should not appear in serialized output"""
        user = User.objects.create_user(email="test@example.com", password="pass123")
        data = UserSerializer(user).data
        
        assert "password" not in data
        assert data["email"] == "test@example.com"

    def test_email_required(self):
        """Email field is required for user creation"""
        data = {"password": "pass123"}
        serializer = UserSerializer(data=data)
        
        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_username_maps_to_first_name(self):
        """username field should map to first_name on model"""
        data = {"email": "user@example.com", "password": "pass", "username": "John"}
        serializer = UserSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        
        assert user.first_name == "John"

    def test_username_fallback_to_email_prefix(self):
        """If first_name empty, to_representation should fallback to email prefix"""
        user = User.objects.create_user(email="john.doe@example.com", password="pass")
        data = UserSerializer(user).data
        
        assert data["username"] == "john.doe"

    def test_date_joined_read_only(self):
        """date_joined should be auto-set and ignore input"""
        from django.utils import timezone
        
        data = {"email": "test@example.com", "password": "pass", "date_joined": "2020-01-01"}
        serializer = UserSerializer(data=data)
        assert serializer.is_valid()
        user = serializer.save()
        
        assert user.date_joined.date() == timezone.now().date()
