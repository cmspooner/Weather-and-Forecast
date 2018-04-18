function mySettings(props) {
  return (
    <Page>
      <Section 
        title={<Text bold align="center">Weather</Text>}>
         <Toggle
           settingsKey="unitToggle"
           label="US or Metric Units"
         />
      </Section>
       <Section
        title={<Text bold align="center">Seperator Bar Color</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#FFCCCC"},
            {color: "#FF7F7F"},
            {color: "#FF4C4C"},
            {color: "#FF0000"},
            {color: "#CC0000"},
            {color: "#990000"},
            {color: "#660000"},
            
            {color: "#FF7700"}, 
            {color: "#FFAB00"},
            {color: "#FFCC00"},
            {color: "#FFFF00"},
            {color: "#E5E533"},
            {color: "#CCCC19"},
            {color: "#999919"},
            
            {color: "#B2FFB2"},
            {color: "#66FF66"},
            {color: "#33FF33"},
            {color: "#00FF00"},
            {color: "#00B200"},
            {color: "#339933"},
            {color: "#196619"},
            
            {color: "#00FF9C"},
            {color: "#00FFB9"},
            {color: "#00FFC8"},
            {color: "#00FFFF"},
            {color: "#00EEFF"},
            {color: "#00CDFF"},
            {color: "#00B6FF"},
            
            {color: "#B2B2FF"},
            {color: "#9999FF"},
            {color: "#4C4CFF"},
            {color: "#0000FF"},
            {color: "#0000B2"},
            {color: "#0000AA"},
            {color: "#004C99"},
           
            {color: "#9600FF"},
            {color: "#BE00FF"},
            {color: "#D300FF"},
            {color: "#FF00FF"},
            {color: "#FF00CB"},
            {color: "#FF009E"},
            {color: "#FF006A"}
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">Contact Me</Text>}>
        <Text>
          Please don't hesitiate to contact me with questions or suggestions. This and all my other apps will always be free and Open Source. If you really like my app please considder buying me a coffee (or more likely electonic components that end up in my classroom). Thanks!
        </Text>
        <Link source="https://rawgit.com/cmspooner/Weather-and-Forecast/master/settings/email.html">
          <TextImageRow
            label="Email"
            sublabel="cmspooner@gmail.com"
            icon="https://github.com/cmspooner/Weather-and-Forecast/blob/master/resources/icons/settings/Email.png?raw=true"
          />
        </Link>
        <Link source="https://github.com/cmspooner">
          <TextImageRow
            label="Github"
            sublabel="https://github.com/cmspooner"
            icon="https://github.com/cmspooner/Weather-and-Forecast/blob/master/resources/icons/settings/Github.png?raw=true"
          />
        </Link>
        <Link source="https://paypal.me/CMSpooner">
          <TextImageRow
            label="PayPal"
            sublabel="cmspooner@gmail.com"
            icon="https://github.com/cmspooner/Weather-and-Forecast/blob/master/resources/icons/settings/Paypal.png?raw=true"
          />
        </Link>
      </Section>
      <Section
        title={<Text bold align="center">Build Version and Notes</Text>}>
        <Text>
          Beta 1.10.6.1: fixed length check.
        </Text>
        <Text>
          Beta 1.10.6: Added click texts.
        </Text>
        <Text>
          Beta 1.10.5: Added force text.
        </Text>
        <Text>
          Beta 1.10.4: Maybe better now??.
        </Text>
        <Text>
          Beta 1.10.3: Added Click to refresh.
        </Text>
        <Text>
          Beta 1.10.2: More start-up tweaks.
        </Text>
        <Text>
          Beta 1.10.1: removed start fetch.
        </Text>
        <Text>
          Beta 1.10: removed start fetch.
        </Text>
        <Text>
          Beta 1.9.1: Resized settings images and fixed email
        </Text>
        <Text>
          Beta 1.9: Added links to settings
        </Text>
        <Text>
          Beta 1.8.1: Copied a little too much from KearsageTime, removed exta unused setting!
        </Text>
        <Text>
          Beta 1.8: Bar color now setable and settings file used properly!
        </Text>
        <Text>
          Beta 1.7: ?Undocumented fix, probably from phone?
        </Text>
        <Text>
          Beta 1.6: Added Location Info
        </Text>
        <Text>
          Beta 1.5.2: Fixed Padding
        </Text>
        <Text>
          Beta 1.5.1: Fixed Crash Error
        </Text>
        <Text>
          Beta 1.5: Played with formatting
        </Text>
        <Text>
          Beta 1.4.1: Missed day 5 when shortening
        </Text>
        <Text>
          Beta 1.4: Shortening Descriptions
        </Text>
        <Text>
          Beta 1.3: Added 2 more days and fixed stupid variable case error
        </Text>
        <Text>
          Beta 1.2: Areas Right size and Sun rise/set
        </Text>
        <Text>
          Beta 1.1: Loading Screen
        </Text>
        <Text>
          Beta 1.0: Works
        </Text>
        <Text>
          Beta 0.1: Starting
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
