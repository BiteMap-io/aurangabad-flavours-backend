import Offer, { IOffer } from '../models/offer.model';

/**
 * @description Service for offer-related operations
 */
class OfferService {
  async createOffer(offerData: Partial<IOffer>): Promise<IOffer> {
    const newOffer = new Offer(offerData);
    return newOffer.save();
  }

  async getOfferById(offerId: string): Promise<IOffer | null> {
    return Offer.findById(offerId).exec();
  }

  async getAllOffers(restaurantId?: string): Promise<IOffer[]> {
    const query = restaurantId ? { restaurantId } : {};
    return Offer.find(query).sort({ createdAt: -1 }).exec();
  }

  async updateOffer(offerId: string, updateData: Partial<IOffer>): Promise<IOffer | null> {
    return Offer.findByIdAndUpdate(offerId, updateData, { new: true }).exec();
  }

  async deleteOffer(offerId: string): Promise<IOffer | null> {
    return Offer.findByIdAndDelete(offerId).exec();
  }
}

export default OfferService;
