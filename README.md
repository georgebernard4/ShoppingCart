This is a modle shopping cart built using react, bootstrap, and strapi.
The strapi has data about the restocking package that will replentish your items.
to start the strapi server open a terminal and enter the following commands
1. cd StrapiShoppingCart/cartDB
2. npm run develop
go to http://locoalhost:1337/admin to change the strapi data
start the program by running index.html with a live server

I've made the information display the stock number, select correct picture, implemented pay to clear cart, implemented a button to hide information accordion, remove an item from the cart, undo last selection, empty cart

In the future, I would like to add a time parameter, which the user can move ahead different amounts,
then gather similar items when restocking, if they are both stocked within a close enough timeframe stored as part of the items information, their would also be a perishable timeframe, given how long the fruit has been on shelf, or based on the date picked provided by the strapi data, restock or time change would remove old produce, or maybe put it on sale

I would like to add different data set the user could use to restock, or purhaps implement ordering and arrival

I would like to set up UI to post to scrapi