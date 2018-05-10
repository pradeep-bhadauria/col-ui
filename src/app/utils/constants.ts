export class Constants {
   public static API_ENDPOINT='http://ws.behindstories.com';
   //public static API_ENDPOINT='http://localhost:5000';
   public static ROLES = {
    ADMIN:2,
    VIEWERS:28,
    AUTHORS:29
   }
   public static DEFAULT = {
    OFFSET:0,
    TABLE_PAGINATION_LIMIT:10,
    TABLE_PAGE_OPTIONS:[10,25,50,100]
   }
}