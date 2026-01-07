import pytest
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.utils import timezone
from api.models import RefreshToken

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    def test_create_user_minimal(self):
        user = User.objects.create_user(email="test@example.com", password="testpass123")
        assert user.id
        assert user.email == "test@example.com"
        assert user.role == "student"
        assert not user.is_verified
        assert user.is_active
        assert not user.is_staff
        assert user.check_password("testpass123")

    def test_email_unique(self):
        User.objects.create_user(email="dup@example.com", password="pass")
        with pytest.raises(IntegrityError):
            User.objects.create_user(email="dup@example.com", password="pass")

    def test_str_representation(self):
        user = User.objects.create_user(email="john@example.com", password="pass")
        assert str(user) == "john@example.com"

    def test_username_field_is_email(self):
        assert User.USERNAME_FIELD == "email"
        assert User.REQUIRED_FIELDS == []


@pytest.mark.django_db
class TestRefreshTokenModel:
    def test_token_creation(self):
        user = User.objects.create_user(email="test@example.com", password="pass")
        token = RefreshToken.objects.create(
            user=user,
            token_hash="fakehash123",
            expires_at=timezone.now() + timedelta(days=7)
        )
        assert str(token.id)
        assert token.user == user
        assert token.revoked is False

    def test_token_cascade_delete(self):
        user = User.objects.create_user(email="cascade@example.com", password="pass")
        token = RefreshToken.objects.create(
            user=user,
            token_hash="test",
            expires_at=timezone.now()
        )
        user.delete()
        assert not RefreshToken.objects.filter(id=token.id).exists()
# checks that the db contains only 1 active token
    def test_token_indexes_query(self):
        user = User.objects.create_user(email="idx@example.com", password="pass")
        RefreshToken.objects.create(user=user, token_hash="hash1", expires_at=timezone.now())
        RefreshToken.objects.create(user=user, token_hash="hash2", revoked=True, expires_at=timezone.now())
        
        assert RefreshToken.objects.filter(token_hash="hash1").exists()
        assert RefreshToken.objects.filter(user=user, revoked=False).count() == 1
