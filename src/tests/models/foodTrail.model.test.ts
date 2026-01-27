import FoodTrail from '../../models/foodTrail.model';
import mongoose from 'mongoose';

describe('FoodTrail Model Test', () => {
  it('should create & save food trail successfully', async () => {
    const validTrail = new FoodTrail({
      name: 'Spicy Trail',
      description: 'A trail for spicy food lovers',
      icon: 'fire-icon',
      color: 'red',
      estimatedTime: '3 hours',
      restaurantsId: [new mongoose.Types.ObjectId()],
      highlights: ['Hot wings', 'Spicy curry'],
    });
    const savedTrail = await validTrail.save();

    expect(savedTrail._id).toBeDefined();
    expect(savedTrail.name).toBe('Spicy Trail');
    expect(savedTrail.color).toBe('red');
  });

  it('should fail validation without required field', async () => {
    const trailWithoutName = new FoodTrail({
      description: '...',
    });
    let err;
    try {
      await trailWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
