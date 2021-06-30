function mySettings(props) {
  return (
    <Page>
      <Section 
        title={<Text bold align="center">Units</Text>}>
         <TextInput
           label="AccuWeather API Key"
           settingsKey="apiKey"
         />
        <Link source="https://www.google.com">
          <Text>
            Get a free AccuWeather API Key.
          </Text>
        </Link>
         <Toggle
           settingsKey="unitToggle"
           label="Set Temperature units to Celsius" 
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
        <Text>Temperatures in degrees {props.settingsStorage.getItem('unit') == "true" ? "celsius" : "fahrenheit"}</Text>
         <Toggle
           settingsKey="distUnitToggle"
           label="Force Distance units to Miles" 
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
        <Text>This is for UK users. Units set by fitbit user profile otherwise.</Text>
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
          Please don't hesitate to contact me with questions or suggestions; but be sure to let me know which app or watchface you are talking about. This and all my other apps will always be free and Open Source. If you really like my app please consider buying me a coffee (or more likely electronic components that end up in my classroom). Thanks!
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
          3.7 Beta: Replaced Yahoo Weather provider (which was decommissioned by Yahoo). AccuWeahter is now in replacing it.
        </Text>
        <Text>
          3.6 Beta: Tweaking red for readablity
        </Text>
        <Text>
          3.5 Beta: Now using styles properly!
        </Text>
        <Text>
          3.4 Beta: Use user units by default.
        </Text>
        <Text>
          3.3 Beta: Adding manual unit over-ride option
        </Text>
        <Text>
          3.2 Beta: Major oopes, including multiple functions with same name
        </Text>
        <Text>
          3.1 Beta: Missed a DOM Ref
        </Text>
        <Text>
          3.0 Beta: Memory Improvements
        </Text>
        <Text>
          2.5 Beta: Settings now shows units
        </Text>
        <Text>
          2.4.1 Beta: Day/Night Icon Fixed, no really this time
        </Text>
        <Text>
          2.4 Beta: Day/Night Icon Fixed
        </Text>
         <Text>
          2.3.1 Beta: Moved timestamp to today header
        </Text>
        <Text>
          2.3 Beta: Added timestamp for old weather
        </Text>
        <Text>
          2.2 Beta: Changed Icon
        </Text>
        <Text>
          2.1 Beta: Adding Weather saving
        </Text>
        <Text>
          1.0: First official release
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
