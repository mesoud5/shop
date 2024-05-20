from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from datetime import datetime
from datetime import date
from wtforms import StringField, SubmitField
from wtforms import StringField, IntegerField, DateField
from wtforms.validators import DataRequired
from wtforms_alchemy import QuerySelectField
from sqlalchemy.orm import relationship
from flask_migrate import Migrate
from sqlalchemy import func, extract
from collections import defaultdict



app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

migrate = Migrate(app, db)



class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"Category('{self.name}')"

class CategoryForm(FlaskForm):
    name = StringField('Category Name', validators=[DataRequired()])
    submit = SubmitField('Add Category')



class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True, default=None)  # Default to None
    quantity = db.Column(db.Integer, nullable=False)
    buying_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.Date, nullable=False, default=datetime.utcnow)

    # Define the relationship with the Category model
    category = db.relationship('Category', backref=db.backref('products', lazy=True))



class ProductForm(FlaskForm):
    name = StringField('Product Name', validators=[DataRequired()])
    category = QuerySelectField('Category', query_factory=lambda: Category.query.all(), get_label='name')
    quantity = IntegerField('Quantity', validators=[DataRequired()])
    buying_price = IntegerField('Buying Price', validators=[DataRequired()])
    selling_price = IntegerField('Selling Price', validators=[DataRequired()])
    date_added = DateField('Date Added', validators=[DataRequired()])


# Define the Sales model
class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))  # Add a foreign key to the Product model

    # Define the relationship with the Product model
    product = db.relationship('Product', backref=db.backref('sales', lazy=True))  # Establish a one-to-many relationship

    def __init__(self, item, price, quantity, total, date, product_id=None):
        self.item = item
        self.price = price
        self.quantity = quantity
        self.total = total
        self.date = date
        self.product_id = product_id  # Set the product_id attribute

    def __repr__(self):
        return f"Sale(id={self.id}, item={self.item}, price={self.price}, quantity={self.quantity}, total={self.total}, date={self.date})"


class SaleForm(FlaskForm):
    item = StringField('Item', validators=[DataRequired()])
    price = IntegerField('Price', validators=[DataRequired()])
    quantity = IntegerField('Quantity', validators=[DataRequired()])
    date = DateField('Date', validators=[DataRequired()])

# Define hardcoded username and password combinations
admin_username = "admin"
admin_password = "mesoud@123"
employee_username = "ekram"
employee_password = "ekram123"

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get username and password from the form
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if username and password are correct for admin
        if username == admin_username and password == admin_password:
            # Redirect to admin dashboard
            return redirect(url_for('admin_dashboard'))

        # Check if username and password are correct for employee
        elif username == employee_username and password == employee_password:
            # Redirect to employee dashboard
            return redirect(url_for('employee_dashboard'))

        else:
            # If username and password are incorrect, show error message and stay on the login page
            error_message = "Invalid username or password. Please try again."
            return render_template('login.html', error_message=error_message)

    # If the request method is GET, render the login page
    return render_template('login.html')

@app.route('/admin_dashboard')
def admin_dashboard():
    # Render the admin dashboard
    return render_template('admin_dashboard.html')

@app.route('/add_category', methods=['GET', 'POST'])
def add_category():
    form = CategoryForm()
    if form.validate_on_submit():
        category = Category(name=form.name.data)
        db.session.add(category)
        db.session.commit()
        flash('Category added successfully!', 'success')
        return redirect(url_for('add_category'))
    return render_template('add_categories.html', form=form)

@app.route('/manage_categories')
def manage_categories():
    categories = Category.query.all()
    return render_template('manage_categories.html', categories=categories)

@app.route('/edit_category/<int:category_id>', methods=['GET', 'POST'])
def edit_category(category_id):
    category = Category.query.get_or_404(category_id)
    form = CategoryForm()
    if form.validate_on_submit():
        category.name = form.name.data
        db.session.commit()
        flash('Category updated successfully!', 'success')
        return redirect(url_for('manage_categories'))
    elif request.method == 'GET':
        form.name.data = category.name
    return render_template('edit_categories.html', form=form, category=category)


@app.route('/delete_category/<int:category_id>', methods=['POST'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    # Find products associated with the category and update their category_id to None
    products = Product.query.filter_by(category_id=category_id).all()
    for product in products:
        product.category_id = None
    # Now delete the category
    db.session.delete(category)
    db.session.commit()
    flash('Category deleted successfully!', 'success')
    return redirect(url_for('manage_categories'))




# Route to add a new product
@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    form = ProductForm()
    if form.validate_on_submit():
        product = Product(
            name=form.name.data,
            category_id=form.category.data.id,  # Accessing category ID from QuerySelectField
            quantity=form.quantity.data,
            buying_price=form.buying_price.data,
            selling_price=form.selling_price.data,
            date_added=form.date_added.data
        )
        db.session.add(product)
        db.session.commit()
        flash('Product added successfully!', 'success')
        return redirect(url_for('add_product'))
    return render_template('add_products.html', form=form)


@app.route('/edit_product/<int:product_id>', methods=['GET', 'POST'])
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    form = ProductForm(obj=product)
    if form.validate_on_submit():
        product.name = form.name.data
        product.category_id = form.category.data.id  # Assign category ID from QuerySelectField
        print("Form Category ID:", form.category.data.id)  # Debugging print statement
        print("Product Category ID Before Update:", product.category_id)  # Debugging print statement
        product.quantity = form.quantity.data
        product.buying_price = form.buying_price.data
        product.selling_price = form.selling_price.data
        product.date_added = form.date_added.data
        db.session.commit()
        flash('Product updated successfully!', 'success')
        return redirect(url_for('manage_products'))
    return render_template('edit_products.html', form=form, product=product)


# Route to delete an existing product
@app.route('/delete_product/<int:product_id>', methods=['POST'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('Product deleted successfully!', 'success')
    return redirect(url_for('manage_products'))

# Route to manage products (list all products)
@app.route('/manage_products')
def manage_products():
    products = Product.query.all()
    return render_template('manage_products.html', products=products)


# Route for adding a new sale
@app.route('/add_sale', methods=['GET', 'POST'])
def add_sale():
    form = SaleForm()
    if form.validate_on_submit():
        # Create a new sale record
        sale = Sale(
            item=form.item.data,
            price=form.price.data,
            quantity=form.quantity.data,
            total=form.price.data * form.quantity.data,
            date=form.date.data
        )
        
        # Find the product by name
        product = Product.query.filter_by(name=form.item.data).first()
        if product:
            # If the product is found, update its quantity
            sale.product_id = product.id  # Set the product_id of the sale
            product.quantity -= form.quantity.data
            db.session.commit()
        else:
            # If the product is not found, display an error message
            flash('Product not found', 'error')
            return redirect(url_for('add_sale'))
        
        # Commit the changes to the database
        db.session.add(sale)  # Add the sale after setting the product_id
        db.session.commit()
        flash('Sale added successfully!', 'success')
        return redirect(url_for('add_sale'))
    return render_template('add_sale.html', form=form)

# Route for viewing all sales
@app.route('/view_sales')
def view_sales():
    sales = Sale.query.all()
    return render_template('view_sales.html', sales=sales)


@app.route('/edit_sale/<int:id>', methods=['GET', 'POST'])
def edit_sale(id):
    sale = Sale.query.get_or_404(id)
    form = SaleForm(obj=sale)

    if form.validate_on_submit():
        form.populate_obj(sale)  # Populate the sale object with form data

        # Recalculate the total based on the updated price and quantity
        sale.total = sale.price * sale.quantity

        db.session.commit()
        flash("Sale record updated successfully", "success")
        return redirect(url_for('view_sales'))

    return render_template('edit_sale.html', form=form)

@app.route('/delete_sale/<int:id>', methods=['POST'])
def delete_sale(id):
    # Fetch the sale record from the database using the provided ID
    # Assume SaleModel is the model representing sales records in the database
    sale = Sale.query.get(id)

    if not sale:
        # Handle the case where the sale record does not exist
        flash("Sale record not found", "error")
    else:
        # Delete the sale record from the database
        db.session.delete(sale)
        db.session.commit()
        flash("Sale record deleted successfully", "success")

    # Redirect to the view sales page after deletion
    return redirect(url_for('view_sales'))





@app.route('/sales_report', methods=['GET', 'POST'])
def sales_report():
    if request.method == 'POST':
        start_date_str = request.form.get('start_date')
        end_date_str = request.form.get('end_date')

        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

        print("Start Date:", start_date)
        print("End Date:", end_date)

        # Query the database for sales records within the specified date range
        sales = Sale.query.filter(Sale.date.between(start_date, end_date)).all()

        print("Sales:", sales)

        # Create an empty list to store sales data with product information
        sales_with_product_info = []

        # Iterate through each sale to fetch associated product information
        for sale in sales:
            # Fetch the associated product for the sale
            product = sale.product

            # Check if the product exists
            if product:
                # If the product exists, add a dictionary containing sale and product information to the list
                sale_info = {
                    'sale': sale,
                    'product_name': product.name,
                    'buying_price': product.buying_price
                }
                sales_with_product_info.append(sale_info)

        print("Sales with Product Info:", sales_with_product_info)

        # Calculate total sales amount and profit using the fetched product information
        total_sales_amount = sum(sale['sale'].total for sale in sales_with_product_info)
        total_profit = total_sales_amount - sum(sale['buying_price'] * sale['sale'].quantity for sale in sales_with_product_info)

        print("Total Sales Amount:", total_sales_amount)
        print("Total Profit:", total_profit)

        return render_template('sales_report.html',
                               sales=sales_with_product_info,
                               total_sales_amount=total_sales_amount,
                               total_profit=total_profit)

    return render_template('sales_report.html')


# Define the new route for monthly sales reports
@app.route('/monthly_sales', methods=['GET', 'POST'])
def monthly_sales():
    if request.method == 'POST':
        selected_month = request.form.get('selected_month')
        
        # Convert the selected month into a datetime object
        selected_date = datetime.strptime(selected_month, '%m').date()
        
        # Print the selected month for debugging
        print("Selected Month:", selected_month)
        
        # Query the database for sales records within the selected month
        sales = Sale.query.filter(extract('month', Sale.date) == selected_date.month).all()
        
        # Print the sales data for debugging
        print("Sales Data:", sales)
        
        # Calculate total sales amount and profit
        total_sales_amount = sum(sale.total for sale in sales)
        total_profit = total_sales_amount - sum(sale.product.buying_price * sale.quantity for sale in sales)
        
        # Print total sales amount and profit for debugging
        print("Total Sales Amount:", total_sales_amount)
        print("Total Profit:", total_profit)
        
        # Render the template with the sales data
        return render_template('monthly_sales_report.html', 
                               sales=sales, 
                               total_sales_amount=total_sales_amount, 
                               total_profit=total_profit)
    else:
        return render_template('monthly_sales_report.html')  # Render the form for GET requests



@app.route('/daily_sales')
def daily_sales():
    # Get the current date
    current_date = date.today()

    # Query the database for sales records on the current day, joining with the Product table
    sales = db.session.query(Sale, Product).filter(Sale.date == current_date).join(Product).all()

    # Prepare a list of dictionaries containing sale and product data
    sales_data = []
    for sale, product in sales:
        sale_data = {
            'id': sale.id,
            'item': sale.item,
            'price': sale.price,
            'quantity': sale.quantity,
            'total': sale.total,
            'date': sale.date,
            'product_name': product.name,
            'buying_price': product.buying_price if product else None
        }
        sales_data.append(sale_data)

    # Calculate total sales amount and profit
    total_sales_amount = sum(sale.total for sale, _ in sales)

    # Calculate total profit, considering None values
    total_profit = 0
    for sale, product in sales:
        if product and product.buying_price:
            total_profit += sale.total - (product.buying_price * sale.quantity)

    # Render the template with the sales data
    return render_template('daily_sales_report.html',
                           sales=sales_data,
                           total_sales_amount=total_sales_amount,
                           total_profit=total_profit,
                           current_date=current_date)


@app.route('/employee_dashboard')
def employee_dashboard():
    # Instantiate SaleForm
    form = SaleForm()

    # Get the current date
    current_date = datetime.today().strftime('%Y-%m-%d')
    
    # Render the employee dashboard with the current date in the context
    return render_template('employee_dashboard.html', current_date=current_date, form=form )


@app.route('/employee_add_sale', methods=['POST'])
def employee_add_sale():
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    try:
        for item in data:
            sale_date = datetime.strptime(item['date'], '%Y-%m-%d').date()
            sale = Sale(
                item=item['item'],
                price=item['price'],
                quantity=item['quantity'],
                total=item['total'],
                date=sale_date
            )

            product = Product.query.filter_by(name=item['item']).first()
            if product:
                sale.product_id = product.id
                product.quantity -= item['quantity']
                db.session.commit()
            else:
                return jsonify({'success': False, 'error': 'Product not found: ' + item['item']}), 400

            db.session.add(sale)

        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/search_product', methods=['GET'])
def search_product():
    query = request.args.get('q', '')
    print('Query:', query)  # Debugging print
    if query:
        products = Product.query.filter(Product.name.ilike(f'{query}%')).all()
        print('Products found:', products)  # Debugging print
        product_list = [{'id': p.id, 'name': p.name, 'price': p.selling_price, 'quantity': p.quantity} for p in products]
        return jsonify(product_list)
    return jsonify([])





@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))



# Route for fetching sales data
@app.route('/fetch_sales_data')
def fetch_sales_data():
    sales = Sale.query.all()
    
    # Use a defaultdict to aggregate sales by date
    sales_by_date = defaultdict(float)
    for sale in sales:
        # Extract the date without the time component
        sale_date = sale.date

        # Add the sale amount to the total for that date
        sales_by_date[sale_date] += sale.total
    
    # Convert the aggregated data to a list of dictionaries
    sales_data = [{'date': date.strftime('%Y-%m-%d'), 'total': total} for date, total in sales_by_date.items()]
    
    # Sort the data by date
    sales_data.sort(key=lambda x: x['date'])
    
    # Return the sales data as JSON
    return jsonify({"sales": sales_data})




if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables
    app.run(debug=True)

