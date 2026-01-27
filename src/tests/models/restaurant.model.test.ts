import Restaurant from '../../models/restaurant.model';
import mongoose from 'mongoose';

describe('Restaurant Model Test', () => {
  it('should create & save restaurant successfully', async () => {
    const validRestaurant = new Restaurant({
      name: 'The Great Indian Kitchen',
      estabilishmentType: 'Fine Dining',
      priceRange: '$$$',
      rating: 4.5,
      image: 'restaurant.jpg',
      gallery: ['img1.jpg', 'img2.jpg'],
      description: 'Authentic cuisine',
      location: {
        type: 'Point',
        coordinates: [75.3433, 19.8762],
        address: 'Aurangabad',
      },
      verified: true,
      ihmRecommended: true,
      area: 'Prozone Mall',
    });
    const savedRestaurant = await validRestaurant.save();

    expect(savedRestaurant._id).toBeDefined();
    expect(savedRestaurant.name).toBe('The Great Indian Kitchen');
    expect(savedRestaurant.rating).toBe(4.5);
  });

  it('should fail validation without required field', async () => {
    const restaurantWithoutName = new Restaurant({
      description: '...',
    });
    let err;
    try {
      await restaurantWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
