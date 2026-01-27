import Event from '../../models/event.model';
import mongoose from 'mongoose';

describe('Event Model Test', () => {
  it('should create & save event successfully', async () => {
    const validEvent = new Event({
      name: 'Food Festival',
      description: 'A great festival',
      date: new Date(),
      location: 'City Center',
      image: 'fest.jpg',
      organizer: 'City Council',
      price: '$10',
      capacity: 500,
    });
    const savedEvent = await validEvent.save();

    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.name).toBe('Food Festival');
    expect(savedEvent.capacity).toBe(500);
  });

  it('should fail validation without required field', async () => {
    const eventWithoutDate = new Event({
      name: 'Undated Event',
      description: '...',
    });
    let err;
    try {
      await eventWithoutDate.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
