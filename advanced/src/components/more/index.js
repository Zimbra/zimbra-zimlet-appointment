import { createElement, Component, render } from 'preact';
import { compose } from 'recompose';
import { withIntl } from '../../enhancers';
import { Text } from 'preact-i18n';
import style from './style';
import { Button } from '@zimbra-client/blocks';

function createMore(props, context) {
   const childIcon = (
      <span class={style.appIcon}>
      </span>);

   //By importing withIntl the json translations from the intl folder are loaded into context, can we can access them directly, or use <Text...
   const zimletStrings = context.intl.dictionary['zimbra-zimlet-appointment-location'];

   const handleClick = (e) => {
      //console.log(this.props);
      //handleLocationChange is a method passed (via props) to the Zimlet slot that allows you to set the location of the appointment
      props.handleLocationChange({ value: ['A location (https://yourVideoConferenceApp.example.coms) can be inserted here'] });

      //Use dispatch/setEvent to set the notes field of the appointment.
      const { dispatch } = context.store;
      const { setEvent } = context.zimletRedux.actions.calendar;

      //props.notes (is a prop passed via the Zimlet slot) that holds the content of the notes field (at the time the user clicks the Zimlet button)
      //It may have user added content.
      //With setEvent the developer can append/prepend or replace (to) the users notes.

      //props.tabId is a prop that holds the Id of the current UI tab (it is also visible in the address bar of the browser, 
      //https://example.com/calendar/event/new?tabid=1599042149583)

      //to set the notes field:
      dispatch(
         setEvent({
            tabId: props.tabId,
            eventData: {
               notes: 'Body text can be set here ' + zimletStrings.dialInText + ' ' + this.props.notes,
               isFormDirty: true
            }
         })
      );

   }

   return (
      <Button
         class={style.button}
         onClick={handleClick}
         brand="primary"
         icon={childIcon}
      >
         <Text id={`zimbra-zimlet-appointment-location.title`} />
      </Button>
   );
}

//By using compose from recompose we can apply internationalization to our Zimlet
//https://blog.logrocket.com/using-recompose-to-write-clean-higher-order-components-3019a6daf44c/
export default compose(
   withIntl()
)
   (
      createMore
   )
