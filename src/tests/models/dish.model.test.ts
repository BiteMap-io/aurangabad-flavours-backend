import Dish from '../../models/dish.model';
import mongoose from 'mongoose';

describe('Dish Model Test', () => {
  it('should create & save dish successfully', async () => {
    const validDish = new Dish({
      name: 'Naan Qalia',
      image: 'naan.jpg',
      category: 'Main Course',
      restaurantId: new mongoose.Types.ObjectId(),
    });
    const savedDish = await validDish.save();

    expect(savedDish._id).toBeDefined();
    expect(savedDish.name).toBe('Naan Qalia');
  });

  it('should fail validation without required field', async () => {
    const dishWithoutName = new Dish({
      image: 'no-name.jpg',
    });
    let err;
    try {
      await dishWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
