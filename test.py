from app import app, db
from app import Product  # Adjust the import based on your project structure

# Create an application context
app_ctx = app.app_context()
app_ctx.push()

try:
    # Your database interaction code goes here
    products = Product.query.filter(Product.name.ilike('ma%')).all()
    for product in products:
        print(product.id, product.name, product.selling_price, product.quantity)

finally:
    # Pop the application context after you're done
    app_ctx.pop()
