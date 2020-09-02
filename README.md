# New appointment Zimlet, video conferencing integration

Depends: https://github.com/ZimbraOS/zm-x-web/pull/2963, OSB ticket.

This article explains how to write a Zimlet that can set the Location and Notes fields on a new appointment. Often this is implemented in Zimlets that integrate 3rd party video conferencing solutions in Zimbra.

## Downloading and running the New appointment Zimlet

Create a folder on your local computer to store the New appointment Zimlet:

      mkdir ~/zimbra_course_pt6
      cd ~/zimbra_course_pt6
      git clone https://github.com/Zimbra/zimbra-zimlet-appointment
      cd zimbra-zimlet-appointment
      npm install
      zimlet watch

The output of this command should be:

```
Compiled successfully!

You can view the application in browser.

Local:            https://localhost:8081/index.js
On Your Network:  https://192.168.1.100:8081/index.js
```

Visit https://localhost:8081/index.js in your browser and accept the self-signed certificate. The index.js is a packed version of the `New appointment Zimlet`. More information about the zimlet command, npm and using SSL certificates can be found in https://github.com/Zimbra/zm-zimlet-guide. 

## Sideload the New appointment Zimlet

Log on to your Zimbra development server and make sure that you are seeing the modern UI. Then append `/sdk/zimlets` to the URL.

> ![](screenshots/03-Sideload.png)
*Sideload the New appointment Zimlet by clicking Load Zimlet. The Zimlet is now added to the Zimbra UI in real-time. No reload is necessary.*

> ![](screenshots/04-NewAppointment.png)
*In Calendar -> New Event you should now see the Zimlet button `Example Appointment Zimlet`*

> ![](screenshots/05-NewAppointmentFilled.png)
*Click the `Example Appointment Zimlet` button to see the Zimlet in action.*

## Visual Studio Code

The `New appointment Zimlet` Zimlet is not a real-world example Zimlet. Instead it has pieces of code that can be used as a cookbook reference. To learn from this Zimlet you should open it in Visual Studio Code and take a look at the methods implemented in the `New appointment Zimlet` button.


Open the folder `~/zimbra_course_pt6/zimbra-zimlet-appointment` in Visual Studio Code to take a look at the code in the New appointment Zimlet. The general structure of the Zimlet and the way menu's are implemented in Zimlet slots has been described in previous guides. Refer to https://wiki.zimbra.com/wiki/DevelopersGuide#Zimlet_Development_Guide.

## Example Appointment Zimlet

The file src/components/more-menu/index.js implements the `New appointment Zimlet` button in the Calendar app under the New Event button. The in-code comments explain how it works:

```javascript
/* https://wiki.zimbra.com/wiki/DevelopersGuide#Zimlet_Development_Guide */
import { createElement, Component, render } from 'preact';
import { withIntl } from '../../enhancers';
import style from './style';
import { Button } from '@zimbra-client/blocks';
import { withText } from 'preact-i18n';

/* Depends: https://github.com/ZimbraOS/zm-x-web/pull/2963 */

@withIntl()
@withText({
    title: 'zm-x-zimlet-appointment.title',
    dialInText: 'zm-x-zimlet-appointment.dialInText',
})
export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.zimletContext = props.children.context;
    };


    handleClick = e => {
      //console.log(this.props);
      //handleLocationChange is a method passed (via props) to the Zimlet slot that allows you to set the location of the appointment
      this.props.handleLocationChange({ value: ['A location (https://yourVideoConferenceApp.example.coms) can be inserted here'] });
      
      //Use dispatch/setEvent to set the notes field of the appointment.
      const { dispatch } = this.zimletContext.store;
      const { setEvent } = this.zimletContext.zimletRedux.actions.calendar;

      //this.props.notes (is a prop passed via the Zimlet slot) that holds the content of the notes field (at the time the user clicks the Zimlet button)
      //It may have user added content.
      //With setEvent the developer can append/prepend or replace (to) the users notes.
      
      //this.props.tabId is a prop that holds the Id of the current UI tab (it is also visible in the address bar of the browser, 
      //https://example.com/calendar/event/new?tabid=1599042149583)

      //to set the notes field:
      dispatch(
         setEvent({
            tabId: this.props.tabId,
            eventData: {
               notes: 'Body text can be set here '+this.props.dialInText + ' ' + this.props.notes,
               isFormDirty: true
            }
         })
      );

      //Alternatively, if you really must you can also interact with TinyMCE directly, but this is NOT recommended:
      //parent.window.tinymce.get('zimbra-notes-' + this.props.tabId).execCommand('mceInsertContent', false, this.props.dialInText + 'someMoreText');
    }

    render() {
        const childIcon = (
            <span class={style.appIcon}>
            </span>);

        return (
            <Button
                class={style.button}
                onClick={this.handleClick}
                brand="primary"
                icon={childIcon}
            >
                {this.props.title}
            </Button>
        );
    }
}
```
