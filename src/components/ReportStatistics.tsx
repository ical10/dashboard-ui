import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';

import * as React from 'react';

import {Home, Profile, Element3, Setting2} from 'iconsax-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'space-evenly',
            },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            icon={<Home size="16" color={theme.palette.primary.main} />}
            iconPosition="start"
            label="Home"
            {...a11yProps(0)}
          />
          <Tab
            icon={<Profile size="16" color={theme.palette.primary.main} />}
            iconPosition="start"
            label="Profile"
            {...a11yProps(1)}
          />
          <Tab
            icon={<Element3 size="16" color={theme.palette.primary.main} />}
            iconPosition="start"
            label="Overview"
            {...a11yProps(2)}
          />
          <Tab
            icon={<Setting2 size="16" color={theme.palette.primary.main} />}
            iconPosition="start"
            label="Settings"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </Box>
  );
}
