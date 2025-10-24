# Uploads Directory

This directory stores uploaded media files from the admin Media Library.

## Contents
- Banner images for the hero section
- Product images added via the admin panel

## File Management
- Files are automatically named with timestamps to prevent conflicts
- Maximum file size: 5MB
- Supported formats: JPEG, JPG, PNG, WebP, GIF

## Security Notes
- This directory is publicly accessible via `/uploads/[filename]`
- Only admins with proper authentication can upload files
- File types and sizes are validated on upload
