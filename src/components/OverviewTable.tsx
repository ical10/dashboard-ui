import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';

import {useState} from 'react';

import PropTypes from 'prop-types';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

type TableDataProps = {
  implementers: string;
  date: Date;
  ghReport: string;
  domain: string;
  urlScanLink: string;
  isTakenDown: boolean;
  isConfirmed: boolean;
  isEligibility: boolean;
};

const OverviewTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows] = useState<TableDataProps[]>([
    {
      implementers: 'Brooklyn Simmons',
      date: new Date('2015-05-27'),
      ghReport: 'PR 1411',
      domain: 'skycloud.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: true,
      isConfirmed: false,
      isEligibility: true,
    },
    {
      implementers: 'Diane Russell',
      date: new Date('2022-07-01'),
      ghReport: 'PR 1411',
      domain: 'connectweb3.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: false,
      isConfirmed: true,
      isEligibility: false,
    },
    {
      implementers: 'Jacob Jones',
      date: new Date('2021-01-30'),
      ghReport: 'PR 1411',
      domain: 'supercpu.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: false,
      isConfirmed: false,
      isEligibility: false,
    },
    {
      implementers: 'Brooklyn Simmons',
      date: new Date('2015-05-27'),
      ghReport: 'PR 1411',
      domain: 'skycloud.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: true,
      isConfirmed: false,
      isEligibility: true,
    },
    {
      implementers: 'Diane Russell',
      date: new Date('2022-07-01'),
      ghReport: 'PR 1411',
      domain: 'connectweb3.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: false,
      isConfirmed: true,
      isEligibility: false,
    },
    {
      implementers: 'Jacob Jones',
      date: new Date('2021-01-30'),
      ghReport: 'PR 1411',
      domain: 'supercpu.com',
      urlScanLink: 'https://urlscan.io/result/011bbfcd-0ada-4fca-9daa-b7ed4f5da935/dom/',
      isTakenDown: false,
      isConfirmed: false,
      isEligibility: false,
    },
  ]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer sx={{width: 'max-content'}} component={Paper}>
      <Table sx={{minWidth: 650, width: '100%'}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Implementers</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">GitHub Report</TableCell>
            <TableCell align="center">Domain</TableCell>
            <TableCell align="center">UrlScan Link</TableCell>
            <TableCell align="center">Taken Down</TableCell>
            <TableCell align="center">Confirmed</TableCell>
            <TableCell align="center">Eligibility</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, i) => (
            <TableRow
              key={`${row.implementers}-${i}`}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row" align="left">
                {row.implementers}
              </TableCell>
              <TableCell align="left">{row.date.toLocaleDateString('en-US')}</TableCell>
              <TableCell align="left">{row.ghReport}</TableCell>
              <TableCell align="left">{row.domain}</TableCell>
              <TableCell align="left">
                {row.urlScanLink ? (
                  <Link href={row.urlScanLink} target="_blank" rel="noreferrer noopener">
                    {row.urlScanLink}
                  </Link>
                ) : (
                  <Typography>No link!</Typography>
                )}
              </TableCell>
              <TableCell align="center">{row.isTakenDown ? 'Yes' : 'No'}</TableCell>
              <TableCell align="center">
                {row.isConfirmed ? (
                  <span role="img" aria-label="checked">
                    ✅
                  </span>
                ) : (
                  <span role="img" aria-label="unckecked">
                    ❌
                  </span>
                )}
              </TableCell>
              <TableCell align="center">{row.isEligibility ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{height: 53 * emptyRows}}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
              colSpan={10}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OverviewTable;
