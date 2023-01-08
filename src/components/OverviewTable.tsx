import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import {
  Typography,
  Skeleton,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import PropTypes from 'prop-types';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

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
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
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

type SubmissionDataProps = {
  id: number;
  domainname: string;
  usid: string;
  proof: null | string;
  exists_in_repo: null | boolean;
  exists_in_db: null | boolean;
  eligible_takendown: null | boolean;
  eligible_submitted: null | boolean;
  ineligible_submitted: null | boolean;
  pull_request_id: null | string;
  status_id: number;
  submitted_by: number;
  createdAt: string;
  updatedAt: string;
};

const OverviewTable = () => {
  const { data: session } = useSession();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [submissions, setSubmissions] = useState<SubmissionDataProps[] | null>(null);

  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    const getAllSubmissions = async () => {
      setLoadingSubmissions(true);

      try {
        if (session) {
          const { sig, address } = session.user;

          const payload = {
            address,
          };

          const resp = await fetch('/api/dashboard', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              Authorization: sig,
            },
          });

          const { data } = await resp.json();
          if (data.length) {
            setSubmissions(data);
            console.log('submissions loaded');
          } else {
            console.log('error');
            // onOpenSnackbar &&
            //   onOpenSnackbar({
            //     message,
            //     type: 'error',
            //   });
          }
        }
      } catch (error) {
        console.warn({ error });
      } finally {
        setLoadingSubmissions(false);
      }
    };

    getAllSubmissions();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && submissions ? Math.max(0, (1 + page) * rowsPerPage - submissions.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isValidHttpUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url;
    } catch (_) {
      const protocol = 'https://';
      return protocol.concat(urlString);
    }
  };

  const extractDomainName = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const { hostname } = url;
      return hostname;
    } catch (_) {
      return urlString;
    }
  };

  if (loadingSubmissions) return <Skeleton variant="rounded" width={900} height={400} />;

  return (
    <>
      <TableContainer sx={{ width: 'max-content' }} component={Paper}>
        <Table sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
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
            {submissions && submissions.length
              ? (rowsPerPage > 0
                  ? submissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : submissions
                ).map((row, i) => (
                  <TableRow
                    key={`${row.submitted_by}-${i}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell id="implementer-id" component="th" scope="row" align="left">
                      {row.submitted_by}
                    </TableCell>
                    <TableCell id="date" align="left">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell id="github-pr" align="left">
                      {row.pull_request_id !== null ? (
                        <a
                          href={`https://github.com/polkadot-js/phishing/pull/${row.pull_request_id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {row.pull_request_id}
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell id="domain-name" align="left">
                      <a
                        href={isValidHttpUrl(row.domainname) as string}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {extractDomainName(row.domainname)}
                      </a>
                    </TableCell>
                    <TableCell id="urlscan-or-image-proof" align="left">
                      {row.proof !== null ? (
                        <a href={row.proof} target="_blank" rel="noreferrer noopener">
                          Image / urlscan proof
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell id="taken-down-status" align="center">
                      {row.status_id ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell id="confirmed-takendown" align="center">
                      {row.eligible_takendown ? (
                        <span role="img" aria-label="checked">
                          ✅
                        </span>
                      ) : (
                        <span role="img" aria-label="unckecked">
                          ❌
                        </span>
                      )}
                    </TableCell>
                    <TableCell id="eligible-submissions" align="center">
                      {row.eligible_submitted === null
                        ? 'NA'
                        : row.eligible_submitted === true
                        ? 'Yes'
                        : 'No'}
                    </TableCell>
                  </TableRow>
                ))
              : null}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={10}
                count={submissions?.length ?? 0}
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
    </>
  );
};

export default OverviewTable;
