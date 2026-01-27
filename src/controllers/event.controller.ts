import { Request, Response } from 'express';
import EventService from '../services/event.service';

/**
 * @author Denizuh
 * @description Controller for event-related operations
 * @date 2026-01-28
 */
class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  /**
   * Handle creating a new event
   * @param req - Express request object
   * @param res - Express response object
   */
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event' });
    }
  };

  /**
   * Handle retrieving an event by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve event' });
    }
  };

  /**
   * Handle retrieving all events
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.eventService.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve events' });
    }
  };

  /**
   * Handle updating an event by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.updateEvent(req.params.id, req.body);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  };

  /**
   * Handle deleting an event by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.deleteEvent(req.params.id);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  };
}

export default new EventController();
