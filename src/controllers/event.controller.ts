import { Request, Response } from 'express';
import EventService from '../services/event.service';
import { decodeBase64, uploadImage } from '../utils/image';

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

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
   */
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventName = req.body.name || 'event';
      const folder = slugify(eventName);

      if (req.file) {
        const f = req.file;
        const { url } = await uploadImage(`events/${folder}`, f.buffer, f.mimetype, f.originalname);
        req.body.image = url;
      } else if (typeof req.body.image === 'string' && (req.body.image.startsWith('data:image/') || req.body.image.length > 500)) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const { url } = await uploadImage(`events/${folder}`, decoded.buffer, decoded.type);
          req.body.image = url;
        }
      }

      if (req.body.capacity) req.body.capacity = Number(req.body.capacity);

      const event = await this.eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  };

  /**
   * Handle retrieving an event by ID
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
   */
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventName = req.body.name || 'updated-event';
      const folder = slugify(eventName);

      if (req.file) {
        const f = req.file;
        const { url } = await uploadImage(`events/${folder}`, f.buffer, f.mimetype, f.originalname);
        req.body.image = url;
      } else if (typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const { url } = await uploadImage(`events/${folder}`, decoded.buffer, decoded.type);
          req.body.image = url;
        }
      }

      if (req.body.capacity) req.body.capacity = Number(req.body.capacity);

      const event = await this.eventService.updateEvent(req.params.id, req.body);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  };

  /**
   * Handle deleting an event by ID
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
