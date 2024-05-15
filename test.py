from app import app
from app import Sale  # Assuming Sale model is defined in models.py within your Flask app package

with app.app_context():
    # Inside this block, you have access to the Flask application and can perform database operations
    sales = Sale.query.all()
    for sale in sales:
        print(sale)


# Route to edit an existing product
@app.route('/edit_product/<int:product_id>', methods=['GET', 'POST'])
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    form = ProductForm(obj=product)
    if form.validate_on_submit():
        product.name = form.name.data
        product.category_id = form.category.data.id  # Assign category ID from QuerySelectField
        product.quantity = form.quantity.data
        product.buying_price = form.buying_price.data
        product.selling_price = form.selling_price.data
        product.date_added = form.date_added.data
        db.session.commit()
        flash('Product updated successfully!', 'success')
        return redirect(url_for('manage_products'))
    return render_template('edit_products.html', form=form, product=product)

