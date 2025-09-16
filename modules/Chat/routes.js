/*
 * IMPORTS
 */
import express from 'express';

/*
 * MIDDLEWARES
 */
import _AuthMiddleware from '../../middlewares/authMiddleware.js';

/*
 * ROUTES
 */
import ChatGetConversation from './conversation/get/route.js';
import ChatStartConversation from './conversation/post/route.js';
import ChatAllConversationDelete from './conversation/allDelete/route.js';
import ChatConversationDelete from './conversation/delete/route.js';
import ChatGetMessages from './message/get/route.js';
import ChatSendMessage from './message/post/route.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * INITIAL PATHS
 */

Router.use('/get/conversation', _AuthMiddleware, ChatGetConversation);
Router.use('/start/conversation', _AuthMiddleware, ChatStartConversation);
Router.use('/delete-all/conversation', _AuthMiddleware, ChatAllConversationDelete);
Router.use('/delete/conversation', _AuthMiddleware, ChatConversationDelete);
Router.use('/get/messages', _AuthMiddleware, ChatGetMessages);
Router.use('/send/messages', _AuthMiddleware, ChatSendMessage);

/*
 * EXPORTS
 */
export default Router;
