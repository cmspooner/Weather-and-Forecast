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
        title={<Text bold align="center">Build Version and Notes</Text>}>
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
