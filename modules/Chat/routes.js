/*
 * IMPORTS
 */
import express from 'express';

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

Router.use('/get/conversation', ChatGetConversation);
Router.use('/start/conversation', ChatStartConversation);
Router.use('/delete-all/conversation', ChatAllConversationDelete);
Router.use('/delete/conversation', ChatConversationDelete);
Router.use('/get/messages', ChatGetMessages);
Router.use('/get/messages', ChatSendMessage);

/*
 * EXPORTS
 */
export default Router;
