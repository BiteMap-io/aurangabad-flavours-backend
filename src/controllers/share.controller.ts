import { Request, Response } from 'express';
import config from '../config';
import RestaurantService from '../services/restaurant.service';

const restaurantService = new RestaurantService();

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * @description Serves a minimal server-rendered HTML page with real Open Graph tags for a
 * restaurant, so link-preview crawlers (WhatsApp, Facebook, Telegram, Discord, etc. — none of
 * which execute JavaScript) show the restaurant's name/photo instead of generic site info.
 * Human visitors land on the same HTML and are redirected into the SPA via meta-refresh + JS;
 * crawlers fetch the metadata and never follow the redirect.
 */
class ShareController {
  restaurantCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurant = await restaurantService.getRestaurantById(req.params.id);
      const redirectUrl = `${config.frontendUrl.replace(/\/$/, '')}/place/${req.params.id}`;

      if (!restaurant) {
        res.redirect(302, redirectUrl);
        return;
      }

      const title = escapeHtml(restaurant.name || 'Aurangabad Flavours');
      const rawDescription = restaurant.description || `${restaurant.cuisine || 'Great food'} in ${restaurant.area || 'Aurangabad'}`;
      const description = escapeHtml(rawDescription.slice(0, 200));
      const image = restaurant.image || `${config.frontendUrl.replace(/\/$/, '')}/og-default.jpg`;
      const pageUrl = `${config.frontendUrl.replace(/\/$/, '')}/v1/share/restaurant/${req.params.id}`;

      res.status(200).set('Content-Type', 'text/html').send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="description" content="${description}" />

<meta property="og:type" content="restaurant.restaurant" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:site_name" content="Aurangabad Flavours Guide" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />

<meta http-equiv="refresh" content="0;url=${redirectUrl}" />
<script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
<p>Redirecting to <a href="${redirectUrl}">${title}</a>&hellip;</p>
</body>
</html>`);
    } catch (error) {
      console.error('Share card error:', error);
      res.redirect(302, `${config.frontendUrl.replace(/\/$/, '')}/place/${req.params.id}`);
    }
  };
}

export default new ShareController();
