from PIL import Image
import os

def resize_and_pad(image_path, target_size, run_name):
    try:
        if not os.path.exists(image_path):
            print(f"File not found: {image_path}")
            return

        img = Image.open(image_path)
        img = img.convert("RGBA")
        
        # Calculate resize ratio
        width, height = img.size
        ratio = min(target_size[0] / width, target_size[1] / height)
        new_size = (int(width * ratio), int(height * ratio))
        
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Create new background (transparent)
        new_img = Image.new("RGBA", target_size, (0, 0, 0, 0))
        
        # Center the image
        x = (target_size[0] - new_size[0]) // 2
        y = (target_size[1] - new_size[1]) // 2
        
        new_img.paste(img, (x, y))
        new_img.save(image_path)
        print(f"Successfully resized {run_name} to {target_size}")
        
    except Exception as e:
        print(f"Error processing {run_name}: {e}")

# Process Icon
resize_and_pad('resources/icon.png', (1024, 1024), "Icon")

# Process Splash
resize_and_pad('resources/splash.png', (2732, 2732), "Splash")
