# discord-dnd-bot
DnD Bot for Discord Server- A simple take on taking in, storing, and outputting information about various DnD related events/items.

---

Current Commands:
- Next Session: access the date of the next session, as set prior (default Jan. 2, 2022)
    - Get: "?nextsession"
    - Set: "?nextsession [date]"
- Quality Quote Me: get a random message from the pinned messages in the qualityquotes channel
    - Get: "?qualityquoteme"
- Current Level: access the current part level, as set prior (default 0)   
    - Get: "?currentlevel"
    - Set: "?currentlevel [value]"
- Split Gold: Split an amount of gold between an amount of players
    - Get: "?splitgold [amount of gold] [amount of players]
- Links: List of saved links
    - Get: "?links"
    - Set: "?links [link]" 
    - Remove: "?links remove [list position]
- Kayla Deaths: Amount of times Kayla's PC's have died
    - Get: "?kayladeaths"
    - Set: "?kayladeaths +" 
- [Debug] Ping: Test command to test bot connectivity
    - Get: "?ping"


---

Changelog-
Version 1.4 (latest)
- Added "kayladeaths" command
    - Saves and retreives the amount of times Kayla's PC has died
    - Get via "kayladeaths"
    - Add one via "kayladeaths +"

Version 1.3 
- Added "links" command
    - Stores a list of links, accessible via their list position, with descriptions
    - View via "links"
    - Add via "links [link]" (Note: link doesn't need to be in https:// format)
    - Remove via "links remove [list position]

Version 1.2
- Added state saving, where information is saved and recovered upon restart of bot
- Changed "nextsession set [date]" to "nextsession [date]" to conform with other commands
- Minor reformatting

Version 1.1
- Added player gold splitting
    - Divides an amount of gold by the amount of players in the group plus a group pot
    - Callable via "splitgold [amount of gold] [number of players]
- Bug fixes

Version 1.0
- Added "nextsession" command
    - Get or set a date as the next DnD session day
    - Get via "nextsession"
    - Set via "nextsession set [date]
- Added "qualityquoteme" command
    - Gets a random quality quote from the pinned messages of the quality quotes chat
    - Get via "qualityquoteme"
- Added "currentlevel" command
    - Gets or sets the current level value
    - Get via "currentlevel"
    - Set via "currentlevel [level value]
- Added "help" command
    - Shows a list of all available commands and details regarding their use
    - Get via "help"
