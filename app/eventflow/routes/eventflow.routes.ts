import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getEventStats } from "../controllers/event.controller";
import { getVenues, getVenue, createVenue, updateVenue, deleteVenue } from "../controllers/venue.controller";
import { getVendors, getVendor, createVendor, updateVendor, deleteVendor } from "../controllers/vendor.controller";
import { getGuests, getGuest, createGuest, updateGuest, deleteGuest, getGuestStats } from "../controllers/guest.controller";
import { getTimeline, getTimelineItem, createTimelineItem, updateTimelineItem, deleteTimelineItem } from "../controllers/timeline.controller";

const router = Router();

// All eventflow routes require authentication
router.use(requireAuth);

// Events
router.get("/events", getEvents);
router.get("/events/stats", getEventStats);
router.get("/events/:id", getEvent);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Venues
router.get("/venues", getVenues);
router.get("/venues/:id", getVenue);
router.post("/venues", createVenue);
router.put("/venues/:id", updateVenue);
router.delete("/venues/:id", deleteVenue);

// Vendors
router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendor);
router.post("/vendors", createVendor);
router.put("/vendors/:id", updateVendor);
router.delete("/vendors/:id", deleteVendor);

// Guests
router.get("/guests", getGuests);
router.get("/guests/stats", getGuestStats);
router.get("/guests/:id", getGuest);
router.post("/guests", createGuest);
router.put("/guests/:id", updateGuest);
router.delete("/guests/:id", deleteGuest);

// Timeline
router.get("/timeline", getTimeline);
router.get("/timeline/:id", getTimelineItem);
router.post("/timeline", createTimelineItem);
router.put("/timeline/:id", updateTimelineItem);
router.delete("/timeline/:id", deleteTimelineItem);

export default router;
