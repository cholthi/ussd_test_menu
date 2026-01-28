## Test USSD Menu FLow
 This repo contains a simple ussd menu application that is provided as part of techincal fitness assesement test for a Junub SMS project.
The developer is required to implement, transalate  the ussd flow diagram below into a working ussd application. Typically, we would like to see at glance how a developer handles session state and persistence for the ussd menu, data storage and general application architecture practices.

### USSD aggregator integration details

<p>__Protocol__: HTTP</p>
<p>__Method__: GET</p>
<p>__query string__:
  - `MSISDN` (phone of the subscriber that initiated the ussd session)
  - `INPUT`  (The data the user typed or sent to the ussd application, the first data is usually initiation short code e.g *183#)
  - `SessionId` (A unique identifier sent by the telco to identify the session)</p>

#### Example request from the telco

http://localhost:9090/ussd_handler.py?MSISDN=211925415377&INPUT=*183#&SessionId=g5767fnn5

#### Sample Response from the application

__Continue Session__: Send header in the response `FreeFlow: FC`
__Terminate Session__: Send header in the response `FreeFlow: FB`
__Content Type__: Send header in the response: `Content_Type: utf-8`
__Response body__: A formatted ascii text representing a menu or data for the user


### Technical Architecture stack

Use any development stack you are confortable. Please keep the code clean and readable.
Use modern software development best practices e.g properly linted code, comments etc


### Sample flow menu application
![USSD sample flow menu](img/text_ussd_menu.drawio.png)
