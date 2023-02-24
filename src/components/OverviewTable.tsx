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
import { useRouter } from 'next/router';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ROLE_ID } from 'src/types/db';
import { SubmissionDataProps } from 'src/types/submission';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage?: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage = 10, onPageChange } = props;

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

const twStyles = {
  groupBlurOnHover: 'group-hover:blur-[1px]',
};

const OverviewTable = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const handleEditSubmission = (id: number) => {
    router.push(
      {
        pathname: `/implementers/edit/`,
        query: {
          submission_id: id,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [submissions, setSubmissions] = useState<SubmissionDataProps[] | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    const getAllSubmissions = async () => {
      setLoadingSubmissions(true);

      try {
        const resp = await fetch('/api', {
          method: 'GET',
        });

        const { data } = await resp.json();

        const { data: responseData } = data;
        if (responseData.length) {
          setSubmissions(responseData);
          return;
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

  const isUser = Boolean(session?.user.user_roles);

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
                ).map(({ url_data, user_data }, i) => (
                  <TableRow
                    key={`${url_data.submitted_by}-${i}`}
                    className="group"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="implementer-id"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {user_data.identifier}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="date"
                      align="left"
                    >
                      {new Date(url_data.createdAt ?? '').toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="github-pr"
                      align="left"
                    >
                      {url_data.pull_request_id !== null ? (
                        <a
                          href={`https://github.com/polkadot-js/phishing/pull/${url_data.pull_request_id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {url_data.pull_request_id}
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="domain-name"
                      align="left"
                    >
                      <a
                        href={isValidHttpUrl(url_data.domainname) as string}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {extractDomainName(url_data.domainname)}
                      </a>
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="urlscan-or-image-proof"
                      align="left"
                    >
                      {url_data.proof !== null ? (
                        <a href={url_data.proof} target="_blank" rel="noreferrer noopener">
                          Image / urlscan proof
                        </a>
                      ) : (
                        <Typography>NA</Typography>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="taken-down-status"
                      align="center"
                    >
                      {url_data.status_id ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="confirmed-takendown"
                      align="center"
                    >
                      {url_data.eligible && url_data.takendown ? (
                        <span role="img" aria-label="checked">
                          ✅
                        </span>
                      ) : (
                        <span role="img" aria-label="unckecked">
                          ❌
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className={clsx(isUser && twStyles.groupBlurOnHover)}
                      id="eligible-submissions"
                      align="center"
                    >
                      {url_data.pr_submitted === null
                        ? 'NA'
                        : url_data.pr_submitted === true
                        ? 'Yes'
                        : 'No'}
                    </TableCell>
                    {session?.user.user_roles.some(e => e.role_id === ROLE_ID.Implementor) &&
                      (session?.user.id as unknown as number) === url_data.submitted_by && (
                        <TableCell
                          id="link-action"
                          className="hidden group-hover:inline-block group-hover:blur-0 group-hover:border-b-0"
                        >
                          <button onClick={() => handleEditSubmission(url_data.id)}>Edit</button>
                        </TableCell>
                      )}
                    {!session?.user && <></>}
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
