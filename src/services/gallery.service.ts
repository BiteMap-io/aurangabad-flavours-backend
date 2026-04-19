import Gallery, { IGallery } from '../models/gallery.model';

class GalleryService {
  /**
   * Create a new gallery item
   * @param data - Item data
   * @returns Created item
   */
  async createGalleryItem(data: Partial<IGallery>): Promise<IGallery> {
    const item = new Gallery(data);
    return await item.save();
  }

  /**
   * Get all gallery items
   * @param tag - Optional tag to filter by
   * @returns List of gallery items
   */
  async getAllItems(tag?: string): Promise<IGallery[]> {
    const query = tag ? { tags: tag } : {};
    return await Gallery.find(query).sort({ createdAt: -1 });
  }

  /**
   * Get gallery item by ID
   * @param id - Item ID
   * @returns Gallery item or null
   */
  async getItemById(id: string): Promise<IGallery | null> {
    return await Gallery.findById(id);
  }

  /**
   * Delete gallery item
   * @param id - Item ID
   */
  async deleteItem(id: string): Promise<void> {
    await Gallery.findByIdAndDelete(id);
  }
}

export default new GalleryService();
