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
