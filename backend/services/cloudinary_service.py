"""Cloudinary image upload and delete helpers."""
import cloudinary
import cloudinary.uploader
from django.conf import settings


def upload_image(file, folder='luxe-parfum/products'):
    """Upload image to Cloudinary. Returns secure URL."""
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        transformation=[
            {'width': 800, 'height': 800, 'crop': 'limit', 'quality': 'auto'},
        ],
        format='webp',
    )
    return result.get('secure_url', '')


def delete_image(public_id):
    """Delete image from Cloudinary by public_id."""
    if public_id:
        cloudinary.uploader.destroy(public_id)


def extract_public_id(cloudinary_url):
    """Extract public_id from a Cloudinary secure URL for deletion."""
    if not cloudinary_url:
        return None
    # URL pattern: .../upload/v1234567890/folder/filename.ext
    try:
        parts = cloudinary_url.split('/upload/')
        if len(parts) == 2:
            path = parts[1]
            # Remove version segment if present
            if path.startswith('v') and '/' in path:
                path = path.split('/', 1)[1]
            # Remove file extension
            public_id = path.rsplit('.', 1)[0]
            return public_id
    except Exception:
        return None
    return None
