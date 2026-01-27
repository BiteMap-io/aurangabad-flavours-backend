import Event, { IEvent } from '../models/event.model';

/**
 * @author Denizuh
 * @description Service for event-related operations
 * @date 2026-01-28
 */
class EventService {
  /**
   * Create a new event
   * @param eventData - Data for the new event
   * @returns The created event document
   */
  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    const newEvent = new Event(eventData);
    return newEvent.save();
  }

  /**
   * Get an event by ID
   * @param eventId - The ID of the event to retrieve
   * @returns The event document or null if not found
   */
  async getEventById(eventId: string): Promise<IEvent | null> {
    return Event.findById(eventId).exec();
  }

  /**
   * Get all events
   * @returns List of all events
   */
  async getAllEvents(): Promise<IEvent[]> {
    return Event.find().exec();
  }

  /**
   * Update an event by ID
   * @param eventId - The ID of the event to update
   * @param updateData - Data to update the event with
   * @returns The updated event document or null if not found
   */
  async updateEvent(eventId: string, updateData: Partial<IEvent>): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(eventId, updateData, { new: true }).exec();
  }

  /**
   * Delete an event by ID
   * @param eventId - The ID of the event to delete
   * @returns The deleted event document or null if not found
   */
  async deleteEvent(eventId: string): Promise<IEvent | null> {
    return Event.findByIdAndDelete(eventId).exec();
  }
}

export default EventService;
