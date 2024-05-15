from app import db
from datetime import datetime

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    @staticmethod
    def default_category():
        default_category = Category.query.filter_by(name='No Category').first()
        if default_category is None:
            default_category = Category(name='No Category')
            db.session.add(default_category)
            db.session.commit()
        return default_category

    def __repr__(self):
        return f"Category('{self.name}')"

