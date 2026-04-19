● BestSecret is an e-commerce platform that offers fashion and lifestyle products at discounted 
prices
● Access to this  site is limited to members only.Account creation cannot be done without 
receiving an invite from an existing user.
● BestSecret is available as a mobile app and as an online website.
● This analysis utilizes Jakob Nielsen’s 10 Usability Heuristics to evaluate and rate the online 
website(www.bestsecret.com)
● For each Usability Heuristic, pros are in green and cons and recommendations in red. 
1. Visibility of system status  -0.8
The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.
Cart Dynamics: cart quantity subscript is 
immediately updated upon addition of 
items(1.3)
Visual Indicators: Side panels for cart 
additions, throbbers for login processing  
and heart icons turning red keep the user 
informed.(1.1,1.2,1.4)
Loading State: When filters are applied, the 
page goes entirely white. There is no 
loading message or "fetching" state to 
inform the user the system is working.
Recommendation: Using a skeleton screen 
or a progress bar when refreshing product 
grids is preferred as it would make user 
informed of the page’s loading.
1.1
1.4
1.2
1.3
2. Match between system and the real world-0.9
The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon.
● Contextual Imagery: Hovering over product images 
shows alternate views (item vs. item-on-model) 
mimicking the real-world experience of seeing a 
garment’s fit. Using a shopping bag icon for the cart 
showing that items added to it will be purchased, similar 
to real world retail.(2.1,2.2,2.3)
● Language Balance: Uses standard category names 
("Dresses") for accessibility but includes fashion-
specific terms ("Dirndl") for specialized shopping.
● Recommendation: Ensure hover-zoom or alternate 
views are consistent across all categories (including the 
homepage) to meet user expectations.
2.1
2.4
2.2
2.3
3. User control and freedom-0.7
Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process.
● Efficiency Shortcut: A "Remove All Filters" button 
allows users to clear their filters and start over 
instantly.(3.3)
● Reversibility: Users can undo accidental cart 
removals.(3.1)
● Wishlist Deletion: No "Undo" option for removing 
items from the wishlist. Items removed from 
wishlist are not immediately removed, however if a 
user isnt paying full attention they may not notice 
that the heart colour has changed and are most 
likely to leave the page or refresh it, removing the 
item from the wishlist page.(3.2)
● Recommendation: Implement a "Deleted" toast 
notification with an "Undo" link that stays active 
for 5 seconds after an item is removed from the 
wishlist.
3.1
3.3
3.2
4. Consistency and standards- 1
Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.
● Navigation Logic: Dropdown menus follow a dual-standard: clicking the word (e.g., "Bags") shows all items, while 
the arrow expands specific sub-types. Selected sections always have their names in bold text throughout.(4.1)
● Visual Uniformity: All items consistently display quantities in subtle grey text, ensuring the price remains the focal 
point while information is still accessible.(4.2).
● Usage of standard e-commerce icons( the generic user icon for the account panel, the padlock and id icon for 
password and contact information, letter for newsletter, question mark for FAQ)(4.3,4.4)
4.1
4.2
4.3
4.4
5. Error prevention- 0.85
Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.
● Real-Time Forms: The system catches invalid zip 
codes so user cannot proceed to next step of 
purchase until error is rectified.
● Stock Management: Out-of-stock items replace 
"Add to Cart" with a "Notify Me" button, 
preventing the error of attempting to purchase 
unavailable goods.
● The same message appears for different phone 
number mistakes. 
● Recommendation: Parameters should be put in 
place so that system is more specific, i.e for when 
too many/too little numbers are entered incase 
user misses a digit or mistakenly adds the same 
digit twice. The same should be done for other 
contant details to prevent user frustration.
After adding my real working number plus 
an extra digit
After adding my real working number, but 
missing a digit
6. Recognition rather than recall-0.5
Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember 
information from one part of the interface to another.
● Persistent Memory: Wishlist and 
cart items remain saved across 
different devices and sessions, 
even after logging out and back 
in.(with timing for cart)
● Information Retrieval: No 
"Recently Viewed" section and no 
personalized recommendations. 
Users must manually search for 
items they looked at minutes 
prior.
● Recommendation: Add a 
"Recently Viewed" strip at the 
bottom of product pages to 
minimize memory load, as seen 
on similar e-commerce platforms 
like ASOS
7. Flexibility and efficiency of use- 0.4
Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both 
inexperienced and experienced users.
● Power User Speed: Tab-key support for autocomplete and Enter-key to initiate 
search.
● Keyboard Limitation: Tabbing through the page only allows vertical scrolling; users 
cannot navigate sideways or select specific interactive elements via keyboard alone.
● Accessibility Barrier: "Alt Text" uses technical code (e.g gallery-image)instead of 
describing the item, failing
visually impaired users.(7.2)
● Recommendations: Make the website more keyboard accessible by ensuring all 
interactive elements (links, buttons, forms) are reachable using the Tab key, operable 
with Enter/Space, and provide a highly visible focus indicator & using native semantic 
HTML (<a>, <button>) to maintain a logical tab order and implement a "skip to 
content" link. This benefits expert users and keyboard limited users.
● Descriptive Alt Text: Replace technical placeholders with dynamic product titles (e.g., 
"Polo Ralph Lauren White
● Shirt - Front View").
8. Aesthetic and minimalist design-0.8
Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with the relevant units of information.
Visual Polish: Strong color contrast (Black, White, 
Gray) supports readability and luxury branding.
Clean Pages: Campaign pages are clean, no extra 
unnecessary text used. (8.1, 8.2, 8.3)
Information Overload: Item details such as product 
information, fits & measurements and materials & 
care provide excess wording that crowds the screen.
Recommendation:  Product information, fits & 
measurements and materials & care can have their 
information hidden and revealed via dropdown menu 
to avoid overcrowding the screen.
8.1 ,8.2& 8.3
No cluttered text, well spaced 
images and simple descriptive 
text.
Less text crowding the 
screen
9. Help users recognize, diagnose, and recover from errors-0.65
Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.
Checkout Guidance: Empty required fields are highlighted with immediate red text to prevent 
submission failure.
Effective 404 Handling: Plain-language error messages inform the user of the issue, followed 
by an automatic 10-second redirect to the homepage.(9.1)
Graceful Redirection: Instead of showing confusing 401/403 error codes, unauthorized or 
invalid links automatically redirect users to the Login or Home page.
Silent Redirections: Redirecting from invalid product links provides no feedback, leaving users 
confused as to why they were moved from their original destination.
Recommendations: 
Link Feedback: Display a brief "Invalid Product Link" message (similar to the 404 style) before 
redirecting to ensure users understand the system's response
9.1
10. Help and documentation-0.6
It’s best if the system doesn’t need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete 
their tasks.
Comprehensive Self-Service: A detailed FAQ section divided into six specific niches 
allows users to resolve queries immediately without waiting for live support.
Intuitive Labeling: Consistent use of symbols and clear category labels across the 
platform reduces user confusion during the search for information.
Low Discoverability: Customer service links are buried in the footer in small text, 
making them difficult to locate quickly.(10.2)
Non-Standard Architecture: FAQ and Help resources are isolated from the main account 
navigation where users typically expect to find them.
Recommendations: Optimize Placement: Move "Help" and "FAQ" links to the primary 
Account Panel or Header for instant access during the shopping journey.
Unified Support Hub: Group the FAQ under a prominent "Customer Service" section to 
align with standard user mental models.
10.2
OVERALL SCORE= 7.2/10
Strengths
● Visual consistency — luxury black/white/grey palette is uniform
● across every page (1.0/1.0)
● Real-world language & icons — hover-to-model imagery, shopping bag cart, and 
familiar category names lower friction (0.9/1.0)
● Error prevention — real-time zip code validation and "Notify Me" button on sold-out 
items stop errors before they occur (0.85/1.0)
● Minimalist design — campaign pages are clean and uncluttered, reinforcing premium 
brand identity (0.8/1.0)
● System feedback — cart side panel, countdown timer, throbbers, and heart icon state 
changes keep users informed (0.8/1.0)
OVERALL SCORE= 7.2/10
Weaknesses & severity
● Critical Accessibility failures — broken keyboard navigation and technical alt text exclude users with 
disabilities (0.4/1.0)
→ Implement full tab-order navigation, Enter/Space operability, visible focus indicators, and descriptive alt 
text per WCAG standards
● Major No "Recently Viewed" or recommendations — users must manually retrace browsing (0.5/1.0)
→ Add a "Recently Viewed" strip at the bottom of product pages, as used by ASOS and Zalando
● Moderate Help buried in footer — FAQ is disconnected from account panel (0.6/1.0)
→ Move "Help" and "FAQ" links to the account panel header for immediate access during shopping
● Moderate Silent invalid-link redirects — no explanation given when users are moved (0.65/1.0)
→ Show a brief "Invalid Product Link" message before redirecting, consistent with the existing 404 page style
● Moderate No wishlist undo — accidental removals cannot be reversed (0.7/1.0)
→ Implement a 5-second "Deleted — Undo" toast notification, mirroring the existing cart undo feature
FINAL EVALUATION
Subjective verdict
BestSecret is a visually polished, brand-coherent 
platform with strong core shopping mechanics. The 
0.7-point gap between its mobile app (4.9/5) and 
Trustpilot website rating (4.2/5) reflects real, 
correctable shortcomings. Its strengths lie in visual 
design and error prevention; its weaknesses in 
accessibility and personalisation. Addressing the 
critical accessibility failures; keyboard navigation and 
alt text, is the single highest-priority fix and would 
meaningfully close the quality gap between platforms.
Target audience suitability- above 
average
● Fashion-conscious online shoppers are 
well served as clean layout and cart 
mechanics match expectations
● Cross-device wishlist and cart persistence 
supports multi-session browsing 
behaviour
● Users with disabilities face genuine 
barriers due to accessibility failures
● Newcomers lack the "Recently Viewed" 
and recommend
